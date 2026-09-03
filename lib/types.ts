export type GalleryItem={url:string;caption?:string};
export type BirthdayContent={
 name:string; birthday:string; greeting:string; message:string; relationship:string;
 heroTitle:string; heroSubtitle:string; reasons:string[]; gallery:GalleryItem[]; videoUrl:string;
 letter:string[]; secret:string; musicUrl:string; theme:string; font:string; primaryColor:string;
 buttonText:string; countdown:boolean; confetti:boolean; fireworks:boolean; hearts:boolean; balloons:boolean;
 timeline:{date:string;title:string;description:string}[]; memories:string[]; wishlist:string[]; guestbook:boolean;
 social:{facebook?:string;instagram?:string;tiktok?:string;youtube?:string}; seoTitle:string; seoDescription:string;
 shareImage?:string; favicon?:string; passwordProtection:boolean; customCss:string;
};
export const defaultContent:BirthdayContent={name:'Riya',birthday:'2026-12-25',greeting:'Happy Birthday',message:'You make every ordinary moment feel special.',relationship:'Best Friend',heroTitle:'A special day for someone special',heroSubtitle:'Made with love by Birthday Builder.',reasons:['Your smile','Your kindness','Your beautiful heart'],gallery:[],videoUrl:'',letter:['Dear Riya,','Thank you for being part of my life.','May your year be full of beautiful memories.'],secret:'You found the secret! 🎁',musicUrl:'',theme:'romantic',font:'sans',primaryColor:'#ec4899',buttonText:'Make a Wish',countdown:true,confetti:true,fireworks:true,hearts:true,balloons:true,timeline:[],memories:[],wishlist:[],guestbook:true,social:{},seoTitle:'Happy Birthday',seoDescription:'A special birthday website.',passwordProtection:false,customCss:''};
