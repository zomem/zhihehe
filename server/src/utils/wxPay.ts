const urllib = require('urllib');
const { KJUR, hextob64 } = require('jsrsasign')
const assert = require('assert')
const x509 = require('@peculiar/x509')

const _crypto: any  = require("crypto")

class Payment {
  appid: string
  mchid: string
  private_key: string
  serial_no: string
  apiv3_private_key: string
  notify_url: string
  urls: any
  certificates: any

  constructor({
    appid = '', mchid = '', private_key = '', serial_no = '', apiv3_private_key = '', notify_url = ''
  }: any = {}) {
    assert(appid, 'appid is required')
    assert(mchid, 'mchid is required')
    assert(private_key, 'private_key is required')
    assert(serial_no, 'serial_no is required')
    assert(apiv3_private_key, 'apiv3_private_key is required')

    this.appid = appid;
    this.mchid = mchid;
    this.private_key = private_key;
    this.serial_no = serial_no;
    this.apiv3_private_key = apiv3_private_key;
    this.notify_url = notify_url;

    this.urls = {
      jsapi: () => {
        return {
          url: 'https://api.mch.weixin.qq.com/v3/pay/transactions/jsapi',
          method: 'POST',
          pathname: '/v3/pay/transactions/jsapi',
        }
      },
      app: () => {
        return {
          url: 'https://api.mch.weixin.qq.com/v3/pay/transactions/app',
          method: 'POST',
          pathname: '/v3/pay/transactions/app',
        }
      },
      h5: () => {
        return {
          url: 'https://api.mch.weixin.qq.com/v3/pay/transactions/h5',
          method: 'POST',
          pathname: '/v3/pay/transactions/h5',
        }
      },
      native: () => {
        return {
          url: 'https://api.mch.weixin.qq.com/v3/pay/transactions/native',
          method: 'POST',
          pathname: '/v3/pay/transactions/native',
        }
      },
      getTransactionsById: ({ pathParams }) => {
        return {
          url: `https://api.mch.weixin.qq.com/v3/pay/transactions/id/${pathParams.transaction_id}?mchid=${this.mchid}`,
          method: `GET`,
          pathname: `/v3/pay/transactions/id/${pathParams.transaction_id}?mchid=${this.mchid}`,
        }
      },
      getTransactionsByOutTradeNo: ({ pathParams }) => {
        return {
          url: `https://api.mch.weixin.qq.com/v3/pay/transactions/out-trade-no/${pathParams.out_trade_no}?mchid=${this.mchid}`,
          method: `GET`,
          pathname: `/v3/pay/transactions/out-trade-no/${pathParams.out_trade_no}?mchid=${this.mchid}`,
        }
      },
      close: ({ pathParams }) => {
        return {
          url: `https://api.mch.weixin.qq.com/v3/pay/transactions/out-trade-no/${pathParams.out_trade_no}/close`,
          method: `POST`,
          pathname: `/v3/pay/transactions/out-trade-no/${pathParams.out_trade_no}/close`,
        }
      },
      refund: () => {
        return {
          url: `https://api.mch.weixin.qq.com/v3/refund/domestic/refunds`,
          method: `POST`,
          pathname: `/v3/refund/domestic/refunds`,
        }
      },
      getRefund: ({ pathParams }) => {
        return {
          url: `https://api.mch.weixin.qq.com/v3/refund/domestic/refunds/${pathParams.out_refund_no}`,
          method: `GET`,
          pathname: `/v3/refund/domestic/refunds/${pathParams.out_refund_no}`,
        }
      },
      getCertificates: () => {
        return {
          url: `https://api.mch.weixin.qq.com/v3/certificates`,
          method: `GET`,
          pathname: `/v3/certificates`,
        }
      },
      tradebill: ({ queryParams }) => {
        let { bill_date, bill_type, tar_type } = queryParams;
        return {
          url: `https://api.mch.weixin.qq.com/v3/bill/tradebill?bill_date=${bill_date}${bill_type ? '&bill_type=' + bill_type : ''}${tar_type ? '&tar_type=' + tar_type : ''}`,
          method: `GET`,
          pathname: `/v3/bill/tradebill?bill_date=${bill_date}${bill_type ? '&bill_type=' + bill_type : ''}${tar_type ? '&tar_type=' + tar_type : ''}`,
        }
      },
      fundflowbill: ({ queryParams }) => {
        let { bill_date, account_type, tar_type } = queryParams;
        return {
          url: `https://api.mch.weixin.qq.com/v3/bill/fundflowbill?bill_date=${bill_date}${account_type ? '&account_type=' + account_type : ''}${tar_type ? '&tar_type=' + tar_type : ''}`,
          method: `GET`,
          pathname: `/v3/bill/fundflowbill?bill_date=${bill_date}${account_type ? '&account_type=' + account_type : ''}${tar_type ? '&tar_type=' + tar_type : ''}`,
        }
      },
      downloadbill: ({ pathParams }) => {
        let url = pathParams;
        let index = url.indexOf('/v3')
        let pathname = url.substr(index)
        return {
          url,
          method: `GET`,
          pathname,
        }
      },
      addreceivers: () => {
        return {
          url: 'https://api.mch.weixin.qq.com/v3/profitsharing/receivers/add',
          method: 'POST',
          pathname: '/v3/profitsharing/receivers/add',
        }
      },
      profitsharing: () => {
        return {
          url: 'https://api.mch.weixin.qq.com/v3/profitsharing/orders',
          method: 'POST',
          pathname: '/v3/profitsharing/orders',
        }
      },
      getProfitsharing: ({ queryParams }) => {
        let { out_order_no, transaction_id } = queryParams
        return {
          url: 'https://api.mch.weixin.qq.com/v3/profitsharing/orders/' + out_order_no + '?&transaction_id=' + transaction_id,
          method: 'GET',
          pathname: '/v3/profitsharing/orders/' + out_order_no + '?&transaction_id=' + transaction_id,
        }
      },
      deletereceivers: () => {
        return {
          url: 'https://api.mch.weixin.qq.com/v3/profitsharing/receivers/delete',
          method: 'POST',
          pathname: '/v3/profitsharing/receivers/delete',
        }
      },
    }
    this.decodeCertificates()
  }

  async run({ pathParams, queryParams, bodyParams, type}: any) {
    assert(type, 'type is required')
    let { url, method, pathname } = this.urls[type]({ pathParams, queryParams })
    let timestamp = Math.floor(Date.now()/1000)
    let onece_str = this.generate()
    let bodyParamsStr = bodyParams && Object.keys(bodyParams).length ? JSON.stringify(bodyParams) : ''
    let signature = this.rsaSign(`${method}\n${pathname}\n${timestamp}\n${onece_str}\n${bodyParamsStr}\n`, this.private_key, 'SHA256withRSA')
    let Authorization = `WECHATPAY2-SHA256-RSA2048 mchid="${this.mchid}",nonce_str="${onece_str}",timestamp="${timestamp}",signature="${signature}",serial_no="${this.serial_no}"`
    let { status, data } = await urllib.request(url, {
      method: method,
      dataType: 'text',
      data: method == 'GET' ? '' : bodyParams,
      timeout: [10000, 15000],
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': Authorization
      },
    })
    return { status, data }
  }

  // ?????? ???????????????
  async addreceivers(params){
    let bodyParams = {
      ...params,
      appid: this.appid,
      mchid: this.mchid,
    }
    return await this.run({ bodyParams, type: 'addreceivers' })
  }

  // ??????
  async profitsharing(params){
    let bodyParams = {
      ...params,
      appid: this.appid,
      mchid: this.mchid,
    }
    return await this.run({ bodyParams, type: 'profitsharing' })
  }

  //??????????????????
  async getProfitsharing(params){
    return await this.run({ queryParams: params, type: 'getProfitsharing' })
  }

  // ?????? ???????????????
  async deletereceivers(params){
    let bodyParams = {
      ...params,
      appid: this.appid,
      mchid: this.mchid,
    }
    return await this.run({ bodyParams, type: 'deletereceivers' })
  }

  //jsapi????????????
  async jsapi(params) {
    let bodyParams = {
      ...params,
      appid: this.appid,
      mchid: this.mchid,
      notify_url: params.notify_url || this.notify_url,
    }
    return await this.run({ bodyParams, type: 'jsapi' })
  }

  //app????????????
  async app(params) {
    let bodyParams = {
      ...params,
      appid: this.appid,
      mchid: this.mchid,
      notify_url: params.notify_url || this.notify_url,
    }
    return await this.run({ bodyParams, type: 'app' })
  }

  //h5????????????
  async h5(params) {
    let bodyParams = {
      ...params,
      appid: this.appid,
      mchid: this.mchid,
      notify_url: params.notify_url || this.notify_url,
    }
    return await this.run({ bodyParams, type: 'h5' })
  }

  //native????????????
  async native(params) {
    let bodyParams = {
      ...params,
      appid: this.appid,
      mchid: this.mchid,
      notify_url: params.notify_url || this.notify_url,
    }
    return await this.run({ bodyParams, type: 'native' })
  }

  //??????transaction_id????????????
  async getTransactionsById(params) {
    return await this.run({ pathParams: params, type: 'getTransactionsById' })
  }

  //??????out_trade_no????????????
  async getTransactionsByOutTradeNo(params) {
    return await this.run({ pathParams: params, type: 'getTransactionsByOutTradeNo' })
  }

  //????????????
  async close(params) {
    return await this.run({
      pathParams: {
        out_trade_no: params.out_trade_no
      }, bodyParams: {
        mchid: this.mchid
      }, type: 'close'
    })
  }

  //??????
  async refund(params) {
    let bodyParams = {
      ...params,
      notify_url: params.notify_url || this.notify_url,
    }
    return await this.run({ bodyParams, type: 'refund' })
  }

  //????????????????????????
  async getRefund(params) {
    return await this.run({ pathParams: params, type: 'getRefund' })
  }

  //????????????????????????
  async getCertificates() {
    return await this.run({ type: 'getCertificates' })
  }

  //?????????????????? ??????CERTIFICATE??????public key
  async decodeCertificates() {
    let result = await this.getCertificates()
    if (result.status != 200) {
      throw new Error('????????????????????????')
    }
    let certificates = typeof result.data == 'string' ? JSON.parse(result.data).data : result.data.data
    for (let cert of certificates) {
      let output = this.decode(cert.encrypt_certificate)
      cert.decrypt_certificate = output.toString()
      let beginIndex = cert.decrypt_certificate.indexOf('-\n')
      let endIndex = cert.decrypt_certificate.indexOf('\n-')
      let str = cert.decrypt_certificate.substring(beginIndex + 2, endIndex)
      let x509Certificate = new x509.X509Certificate(Buffer.from(str, 'base64'));
      let public_key = Buffer.from(x509Certificate.publicKey.rawData).toString('base64')
      cert.public_key = `-----BEGIN PUBLIC KEY-----\n` + public_key + `\n-----END PUBLIC KEY-----`
    }
    return this.certificates = certificates
  }

  //???????????? timestamp,nonce,serial,signature??????HTTP????????????,body??????????????? repeatVerify = true
  async verifySign({ timestamp, nonce, serial, body, signature }, repeatVerify = true) {
    let data = `${timestamp}\n${nonce}\n${typeof body == 'string' ? body : JSON.stringify(body)}\n`;
    let verify = _crypto.createVerify('RSA-SHA256');
    verify.update(Buffer.from(data));
    let verifySerialNoPass = false;
    for (let cert of this.certificates) {
      if (cert.serial_no == serial) {
        verifySerialNoPass = true;
        return verify.verify(cert.public_key, signature, 'base64');
      }
    }
    if (!verifySerialNoPass && repeatVerify) {
      await this.decodeCertificates();
      return await this.verifySign({ timestamp, nonce, serial, body, signature }, false)
    } else {
      throw new Error('??????????????????????????????')
    }
  }


  //??????????????????
  async tradebill(params) {
    return await this.run({ queryParams: params, type: 'tradebill' })
  }

  //??????????????????
  async fundflowbill(params) {
    return await this.run({ queryParams: params, type: 'fundflowbill' })
  }

  //????????????
  async downloadbill(download_url) {
    return await this.run({ pathParams: download_url, type: 'downloadbill' })
  }


  //????????????????????????????????????
  decodeResource(resource) {
    let plaintext = this.decode(resource)
    return JSON.parse(plaintext.toString());
  }

  //??????
  decode(params) {
    const AUTH_KEY_LENGTH = 16;
    // ciphertext = ?????????associated_data = ??????????????? nonce = ??????
    const { ciphertext, associated_data, nonce } = params;
    // ??????
    const key_bytes = Buffer.from(this.apiv3_private_key, 'utf8');
    // ??????
    const nonce_bytes = Buffer.from(nonce, 'utf8');
    // ????????????
    const associated_data_bytes = Buffer.from(associated_data, 'utf8');
    // ??????Buffer
    const ciphertext_bytes = Buffer.from(ciphertext, 'base64');
    // ????????????16?????????
    const cipherdata_length = ciphertext_bytes.length - AUTH_KEY_LENGTH;
    // upodata
    const cipherdata_bytes = ciphertext_bytes.slice(0, cipherdata_length);
    // tag
    const auth_tag_bytes = ciphertext_bytes.slice(cipherdata_length, ciphertext_bytes.length);
    const decipher = _crypto.createDecipheriv(
        'aes-256-gcm', key_bytes, nonce_bytes
    );
    decipher.setAuthTag(auth_tag_bytes);
    decipher.setAAD(Buffer.from(associated_data_bytes));

    const output = Buffer.concat([
        decipher.update(cipherdata_bytes),
        decipher.final(),
    ]);
    return output;
  }

  //?????????????????????
  generate(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let noceStr = '', maxPos = chars.length;
    while (length--) noceStr += chars[Math.random() * maxPos | 0];
    return noceStr;
  }


  /**
   * rsa??????
   * @param content ????????????
   * @param privateKey ?????????PKCS#1
   * @param hash hash?????????SHA256withRSA???SHA1withRSA
   * @returns ????????????????????????base64
   */
  rsaSign(content, privateKey, hash = 'SHA256withRSA') {
    // ?????? Signature ??????
    const signature = new KJUR.crypto.Signature({
      alg: hash,
      //!???????????? ?????? pem!
      prvkeypem: privateKey
    })
    signature.updateString(content)
    const signData = signature.sign()
    // ???????????????base64
    return hextob64(signData)
  }
}

module.exports = Payment;