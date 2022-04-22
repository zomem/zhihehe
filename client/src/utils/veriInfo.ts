
//身份证 判断
var checkProv = function (val:any) {
  var pattern = /^[1-9][0-9]/;
  var provs:any = {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门"};
  if(pattern.test(val)) {
      if(provs[val]) {
          return true;
      }
  }
  return false;
}
var checkDate = function (val:any) {
  var pattern = /^(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)$/;
  if(pattern.test(val)) {
      var year = val.substring(0, 4);
      var month = val.substring(4, 6);
      var date = val.substring(6, 8);
      var date2 = new Date(year+"-"+month+"-"+date);
      if(date2 && date2.getMonth() === (parseInt(month) - 1)) {
          return true;
      }
  }
  return false;
}
var checkCode = function (val:any) {
  var p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
  var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
  var code = val.substring(17);
  if(p.test(val)) {
      var sum = 0;
      for(var i=0;i<17;i++) {
          sum += val[i]*factor[i];
      }
      if(parity[sum % 11] === code.toUpperCase()) {
          return true;
      }
  }
  return false;
}

export const isIDCard = function (val: string) {
  if(checkCode(val)) {
    var date = val.substring(6,14);
    if(checkDate(date)) {
        if(checkProv(val.substring(0,2))) {
            return true;
        }
    }
  }
  return false;
}


//邮箱判断
export const isEmail = (str: string) => {
  let reg=/^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+.[a-zA-Z]{2,3}$/ig;
  return reg.test(str)
}


//手机 
export const isPhone = (str: string) => {
  return /^1[3456789]\d{9}$/.test(str)
}
//座机
export const isCall = (str: string) => {
  let phoneReg=/^(\d{4}-\d{7,8}|\d{3}-\d{8})$/
  return phoneReg.test(str)
}
//网址
export const isWebSite = (str: string) => {
  var urlReg=/[(https?|ftp|file):\/\/]?[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/
  return urlReg.test(str)
}
//QQ
export const isQQ = (str: string) => {
  let qqReg=/^[1-9]\d{4,10}$/
  return qqReg.test(str)
}




// 价格校验
export const isPrice = (_keyword: string) => {
  if(_keyword === "0" || _keyword === "0.0" || _keyword === "0.00"){
      return true
  }
  var index = _keyword.indexOf("0")
  var length = _keyword.length
  if(index == 0 && length>1){/*0开头的数字串*/
      var reg = /^[0]{1}[.]{1}[0-9]{1,2}$/
      if(!reg.test(_keyword)){
          return false
      }else{
          return true
      }
  }else{/*非0开头的数字*/
      var reg = /^[1-9]{1}[0-9]{0,10}[.]{0,1}[0-9]{0,2}$/;
      if(!reg.test(_keyword)){
          return false
      }else{
          return true
      }
  }
}
