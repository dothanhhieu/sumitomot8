import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation';

import AuthLoading from '../Component/Authenticate/AuthLoading'
import Login from '../Component/Authenticate/Login'
import OutletList from '../Component/Home/OutletList'
import Profile from '../Component/User/Profile'
import OutletDetail from '../Component/Detail/OutletDetail'
import UploadImage from '../Component/UploadImage/UploadImage'
import GiftSurvey from '../Component/Detail/GiftSurvey'
import GiftImage from '../Component/Detail/GiftImage'
import Receiver from '../Component/Detail/Receiver'
import UpdateAddress from '../Component/Farmer/UpdateAddress'
import FarmerSurvey from '../Component/Farmer/FarmerSurvey'
import ProductPackageImage from '../Component/Farmer/ProductPackageImage'
import GiftImage1 from '../Component/Farmer/GiftImage'
import ChooseProducts from '../Component/Farmer/YesAnswer/ChooseProducts'
import ProductDetail from '../Component/Farmer/YesAnswer/ProductDetail'
import FutureProducts from '../Component/Farmer/YesAnswer/FutureProducts'
import CultivatedArea from '../Component/Farmer/YesAnswer/CultivatedArea'
import ImageFinal from '../Component/Farmer/YesAnswer/ImageFinal'
import ProductKnowledge from '../Component/Farmer/NoAnswer/ProductKnowledge'
import NewProducts from '../Component/Farmer/NoAnswer/NewProducts'
import TechnicalProperties from '../Component/Farmer/NoAnswer/TechnicalProperties'
import ListDetailEvent from '../Component/Event/ListDetailEvent'
import DetailEvent from '../Component/Event/DetailEvent'
import ListTypeAudit from '../Component/Event/ListTypeAudit'
import TypeAuditDetail from '../Component/Event/TypeAuditDetail'
import NotSurvey from '../Component/Event/NotSurvey'
import FinalEvent from '../Component/Event/FinalEvent'

import CreateStore from '../Component/Store/CreateStore'
import ImageStore from '../Component/Store/ImageStore'
import FinalStore from '../Component/Store/FinalStore'
import CreateFarmer from '../Component/Farmers/CreateFarmer'
import ImageFarmer from '../Component/Farmers/ImageFarmer'
import FinalFarmer from '../Component/Farmers/FinalFarmer'

const AppStack = createStackNavigator({ 
  Home: ListDetailEvent,
  DetailEvent: DetailEvent,
  ListTypeAudit: ListTypeAudit,
  TypeAuditDetail: TypeAuditDetail,
  OutletList: OutletList, 
  Profile: Profile, 
  OutletDetail: OutletDetail, 
  GiftSurvey: GiftSurvey, 
  GiftImage: GiftImage, 
  Receiver: Receiver,
  UpdateAddress: UpdateAddress, 
  FarmerSurvey: FarmerSurvey, 
  ProductPackageImage: ProductPackageImage, 
  GiftImage1: GiftImage1, 
  UploadImage: UploadImage,
  ChooseProducts: ChooseProducts,
  ProductDetail: ProductDetail,
  FutureProducts: FutureProducts,
  CultivatedArea: CultivatedArea,
  ImageFinal: ImageFinal,
  ProductKnowledge: ProductKnowledge,
  NewProducts: NewProducts,
  TechnicalProperties: TechnicalProperties,
  ListDetailEvent: ListDetailEvent,
  CreateStore: CreateStore,
  ImageStore: ImageStore,
  FinalStore: FinalStore,
  CreateFarmer: CreateFarmer,
  ImageFarmer: ImageFarmer,
  FinalFarmer: FinalFarmer,
  NotSurvey: NotSurvey,
  FinalEvent: FinalEvent
});

const AuthStack = createStackNavigator({ Login: Login });

const AppIndex = createSwitchNavigator(
  {
    AuthLoading: AuthLoading,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
);

export default createAppContainer(AppIndex)