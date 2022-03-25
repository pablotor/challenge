export interface BoardResponse {
  id: string;
  name: string;
  desc: string;
  descData: null;
  closed: boolean;
  idOrganization: string;
  idEnterprise: null;
  pinned: boolean;
  url: string;
  shortUrl: string;
  prefs: {
    permissionLevel: string;
    hideVotes: boolean;
    voting: string;
    comments: string;
    invitations: string;
    selfJoin: boolean;
    cardCovers: boolean;
    isTemplate: boolean;
    cardAging: string;
    calendarFeedEnabled: boolean;
    hiddenPluginBoardButtons: [];
    background: string;
    backgroundColor: string;
    backgroundImage: null;
    backgroundImageScaled: null;
    backgroundTile: boolean;
    backgroundBrightness: string;
    backgroundBottomColor: string;
    backgroundTopColor: string;
    canBePublic: boolean;
    canBeEnterprise: boolean;
    canBeOrg: boolean;
    canBePrivate: boolean;
    canInvite: boolean;
  };
  labelNames: {
    green: string;
    yellow: string;
    orange: string;
    red: string;
    purple: string;
    blue: string;
    sky: string;
    lime: string;
    pink: string;
    black: string;
  };
}

export interface ListResponse {
  id: string;
  name: string;
  closed: boolean;
  idBoard: string;
  pos: number;
}

export interface CardResponse {
  attachments: [],
  id: string;
  badges: {
    attachmentsByType: {
      trello: unknown;
    };
    location: boolean;
    votes: number;
    viewingMemberVoted: boolean;
    subscribed: boolean;
    fogbugz: string;
    checkItems: number;
    checkItemsChecked: number;
    checkItemsEarliestDue: null;
    comments: number;
    attachments: number;
    description: boolean;
    due: null;
    dueComplete: boolean;
    start: null;
  },
  checkItemStates: [],
  closed: boolean;
  dueComplete: boolean;
  dateLastActivity: string;
  desc: string;
  descData: {
    emoji: unknown;
  };
  due: null;
  dueReminder: null;
  email: null;
  idBoard: string;
  idChecklists: [],
  idList: string;
  idMembers: [],
  idMembersVoted: [],
  idShort: number;
  idAttachmentCover: null;
  labels: [],
  idLabels: [],
  manualCoverAttachment: boolean;
  name: string;
  pos: number;
  shortLink: string;
  shortUrl: string;
  start: null;
  subscribed: boolean;
  url: string;
  cover: {
    idAttachment: null;
    color: null;
    idUploadedBackground: null;
    size: string;
    brightness: string;
    idPlugin: null;
  },
  isTemplate: boolean;
  cardRole: null;
  stickers: [],
}

export interface Card {
  id: string;
  title: string;
  year: number;
  listId: string;
}

export interface List {
  name: string;
  id: string;
  boardId: string;
  cards: Card[];
}

export interface Board {
  name: string;
  id: string;
  lists: List[];
  cards: Card[];
}
