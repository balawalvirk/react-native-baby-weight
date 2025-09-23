import {Image} from 'react-native';
import shareFacebook from '../../assets/social/share_facebook.png';
import shareTwitter from '../../assets/social/share_twitter.png';
import shareInstagram from '../../assets/social/share_instagram.png';
import shareSnapchat from '../../assets/social/share_snapchat.png';
import shareWhatsapp from '../../assets/social/share_whatsapp.png';
import shareGooglePlus from '../../assets/social/share_google_plus.png';
import shareGmail from '../../assets/social/share_gmail.png';
import shareOutlook from '../../assets/social/share_outlook.png';
import icNewProfilePic from '../../assets/ic_new_profile_pic.png';

const icNewProfilePicUri = Image.resolveAssetSource(icNewProfilePic).uri;
const shareFacebookUri = Image.resolveAssetSource(shareFacebook).uri;
const shareTwitterUri = Image.resolveAssetSource(shareTwitter).uri;
const shareInstagramUri = Image.resolveAssetSource(shareInstagram).uri;
const shareSnapchatUri = Image.resolveAssetSource(shareSnapchat).uri;
const shareWhatsappUri = Image.resolveAssetSource(shareWhatsapp).uri;
const shareGooglePlusUri = Image.resolveAssetSource(shareGooglePlus).uri;
const shareGmailUri = Image.resolveAssetSource(shareGmail).uri;
const shareOutlookUri = Image.resolveAssetSource(shareOutlook).uri;

export {
  icNewProfilePicUri,
  shareFacebookUri,
  shareTwitterUri,
  shareInstagramUri,
  shareSnapchatUri,
  shareWhatsappUri,
  shareGooglePlusUri,
  shareGmailUri,
  shareOutlookUri,
};
