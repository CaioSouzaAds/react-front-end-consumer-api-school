// eslint-disable-next-line no-unused-vars
import { call, put, all, takeLatest } from 'redux-saga/effects';
// eslint-disable-next-line no-unused-vars
import { toast } from 'react-toastify';
// eslint-disable-next-line no-unused-vars
import * as actions from './actions';
import * as types from '../types';

// eslint-disable-next-line require-yield
function* loginRequest({ payload }) {
  console.log('SAGA', payload);
}

export default all([takeLatest(types.LOGIN_REQUEST, loginRequest)]);
