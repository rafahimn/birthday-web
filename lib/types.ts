export type GalleryItem={url:string;caption?:string};
export type Recipient={id:string;name:string;email?:string;relationship?:string;message?:string;avatarUrl?:string;language?:string};
export type GroupMember={name:string;role?:string;message:string;avatarUrl?:string};
export type Badge={id:string;label:string;icon:string;description?:string};
export type BirthdayContent={
 name:string; birthday:string; greeting:string; message:string; relationship:string;
 heroTitle:string; heroSubtitle:string; reasons:string[]; gallery:GalleryItem[]; videoUrl:string;
 letter:string[]; secret:string; musicUrl:string; theme:string; font:string; primaryColor:string;
 buttonText:string; countdown:boolean; confetti:boolean; fireworks:boolean; hearts:boolean; balloons:boolean;
 timeline:{date:string;title:string;description:string}[]; memories:string[]; wishlist:string[]; guestbook:boolean;
 social:{facebook?:string;instagram?:string;tiktok?:string;youtube?:string}; seoTitle:string; seoDescription:string;
 shareImage?:string; favicon?:string; passwordProtection:boolean; customCss:string;
 profile?:{displayName?:string;avatarUrl?:string;bio?:string};
 recipients:Recipient[];
 referralEnabled:boolean; referralCode?:string;
 madeWithBadge:boolean; whatsappShare:boolean; messengerShare:boolean;
 gamificationEnabled:boolean; badges:Badge[];
 groupBirthdayEnabled:boolean; groupMembers:GroupMember[];
 templateSpotlight?:boolean;
 timeCapsuleEnabled:boolean; timeCapsuleUnlockAt?:string; timeCapsuleMessage?:string;
 collaborativeWishesEnabled:boolean; liveReactionsEnabled:boolean;
 pdfDownloadEnabled:boolean;
 language:string; translations:Record<string,Partial<Pick<BirthdayContent,'greeting'|'message'|'heroTitle'|'heroSubtitle'|'buttonText'>>>;
 googlePhotosEnabled:boolean;
};
export const defaultContent:BirthdayContent={
 name:'Riya',birthday:'2026-12-25',greeting:'Happy Birthday',message:'You make every ordinary moment feel special.',relationship:'Best Friend',
 heroTitle:'A special day for someone special',heroSubtitle:'Made with love by Birthday Builder.',reasons:['Your smile','Your kindness','Your beautiful heart'],gallery:[],videoUrl:'',
 letter:['Dear Riya,','Thank you for being part of my life.','May your year be full of beautiful memories.'],secret:'You found the secret! 🎁',musicUrl:'',
 theme:'romantic',font:'sans',primaryColor:'#ec4899',buttonText:'Make a Wish',countdown:true,confetti:true,fireworks:true,hearts:true,balloons:true,
 timeline:[],memories:[],wishlist:[],guestbook:true,social:{},seoTitle:'Happy Birthday',seoDescription:'A special birthday website.',
 shareImage:'',favicon:'',passwordProtection:false,customCss:'',
 profile:{displayName:'',avatarUrl:'',bio:''},recipients:[],referralEnabled:true,referralCode:'',madeWithBadge:true,whatsappShare:true,messengerShare:true,
 gamificationEnabled:true,badges:[],groupBirthdayEnabled:false,groupMembers:[],templateSpotlight:false,timeCapsuleEnabled:false,timeCapsuleUnlockAt:'',
 timeCapsuleMessage:'A message from the past 💌',collaborativeWishesEnabled:true,liveReactionsEnabled:true,pdfDownloadEnabled:true,
 language:'en',translations:{},googlePhotosEnabled:false
};
