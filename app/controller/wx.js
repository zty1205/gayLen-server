'use strict';
const Project = require('../../project.config.js');
const Controller = require('egg').Controller;
const WXBizDataCrypt = require('../../utils/WXBizDataCrypt');

const appId = Project.WX.appId;
const secret = Project.WX.appSecret;
let session_key = '';

class WxController extends Controller {
  async index() {
    const { ctx } = this;
    const query = ctx.request.query;
    const url = 'https://api.weixin.qq.com/sns/jscode2session';
    const result = await ctx.curl(url, {
      method: 'GET', // 设置请求方式 默认是GET
      dataType: 'json',
      // contentType: 'json', // 默认是 form
      data: {
        appId,
        secret,
        js_code: query.code,
        grant_type: 'authorization_code'
      },
      dataAsQueryString: true
    });
    session_key = result.data.session_key;
    ctx.body = result;
  }
  async decrypt() {
    // digital envelope routines:EVP_DecryptFinal_ex:bad decrypt 解密失败就是code/session 失效了
    const { ctx } = this;
    const body = ctx.request.body;
    const { encryptedData, iv } = body;
    const pc = new WXBizDataCrypt(appId, session_key);
    const data = pc.decryptData(encryptedData, iv);
    ctx.body = data;
  }
}

module.exports = WxController;
