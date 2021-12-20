import readline from 'readline';
import puppeteer from 'puppeteer';

const browser = puppeteer.launch({
  args: [`--window-size=1920,1080`],
  defaultViewport: {
    width: 1920,
    height: 1080,
  },
});

const question = (question: string, options: { hidden?: boolean } = {}) =>
  new Promise<string>((resolve) => {
    const input = process.stdin;
    const output = process.stdout;

    type Rl = readline.Interface & { history: string[] };
    const rl = readline.createInterface({ input, output }) as Rl;

    if (options.hidden) {
      const onDataHandler = (charBuff: Buffer) => {
        const char = charBuff + '';
        switch (char) {
          case '\n':
          case '\r':
          case '\u0004':
            input.removeListener('data', onDataHandler);
            break;
          default:
            output.clearLine(0);
            readline.cursorTo(output, 0);
            output.write(question);
            break;
        }
      };
      input.on('data', onDataHandler);
    }

    rl.question(question, (answer) => {
      if (options.hidden) rl.history = rl.history.slice(1);
      rl.close();
      resolve(answer);
    });
  });

export const signin = async () => {
  console.info('Opening linkedin');
  const page = await (await browser).newPage();
  await page.goto('https://www.linkedin.com/login');
  const usernameInput = await page.$('#username');
  const passwordInput = await page.$('#password');
  const submitInput = await page.$('.login__form_action_container');
  if (!usernameInput || !passwordInput) throw Error('Missing input');
  const userInfo = {
    username: '',
    password: '',
    pin: '',
  };
  userInfo.username = await question('Enter your username: \n');
  userInfo.password = await question('Enter your password: \n', { hidden: true });
  await usernameInput.type(userInfo.username);
  await passwordInput.type(userInfo.password);
  await submitInput?.click();
  await page.waitForNavigation({waitUntil: 'networkidle2'});
  if (page.url() === 'https://www.linkedin.com/feed/')
    console.info('Successful SignIn')
  else {
    console.error('There was a problem with the SignIn')
    console.log('URL:', page.url());
    console.log(await page.evaluate(() => document.body.innerHTML));
    await page.screenshot({
      path: './screenshot.png',
    });
  }
  await page.close();
};
