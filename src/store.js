import {
  createStore,
  applyMiddleware
} from 'redux';
import thunk from 'redux-thunk';
import RootReduers from './reduers';


export default createStore(RootReduers, applyMiddleware(thunk));