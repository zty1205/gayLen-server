'use strict';
const Project = require('../../project.config');
const path = require('path');
const PingPP = require('pingpp');
const Controller = require('egg').Controller;

const key = Project.PingPP.key;
const app_id = Project.PingPP.appId;
const pem = path.resolve(__dirname, '../../rsa_private_key.pem');

const ping = new PingPP(key);

ping.setAppID(app_id);
ping.setPrivateKeyPath(pem);

class PayController extends Controller {
  async index() {
    const { ctx } = this;

    const charge = await ping.charges.create({
      order_no: '12345678',
      app: { id: app_id },
      channel: 'alipay_wap',
      amount: 1,
      client_ip: '127.0.0.1',
      currency: 'cny',
      subject: 'Your Subject',
      body: 'Your Body',
      extra: {
        success_url: 'http://www.baidu.com'
      }
    });
    ctx.body = charge;
  }
}

module.exports = PayController;
