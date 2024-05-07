import { RequestHandler } from "express";
import { DataRuntime } from "../helper/Data";
import { sleep } from "@/common/utils/helper";
const isEmpty = (data: any) => data === undefined || data === null || data === '';
export const QQGetQRcodeHandler: RequestHandler = async (req, res) => {
    if (await DataRuntime.getQQLoginStatus()) {
        res.send({
            code: -1,
            message: 'QQ Is Logined'
        });
        return;
    }
    let qrcodeUrl = await DataRuntime.getQQLoginQrcodeURL();
    if (isEmpty(qrcodeUrl)) {
        res.send({
            code: -1,
            message: 'QRCode Get Error'
        });
        return;
    }
    res.send({
        code: 0,
        message: 'success',
        data: {
            qrcode: qrcodeUrl
        }
    });
    return;
};
export const QQCheckLoginStatusHandler: RequestHandler = (req, res) => {
    res.send({
        code: 0,
        message: 'success',
        data: {
            isLogin: DataRuntime.getQQLoginStatus()
        }
    });
};
export const QQSetQuickLoginHandler: RequestHandler = async (req, res) => {
    let { uin } = req.body;
    let isLogin = await DataRuntime.getQQLoginStatus();
    if (isLogin) {
        res.send({
            code: -1,
            message: 'QQ Is Logined'
        });
        return;
    }
    if (isEmpty(uin)) {
        res.send({
            code: -1,
            message: 'uin is empty'
        });
        return;
    }
    let ret = await DataRuntime.getQQQuickLogin(uin);
    if (!ret.result) {
        res.send({
            code: -1,
            message: ret.message
        });
        return;
    }
    //本来应该验证 但是http不宜这么搞 建议前端验证
    //isLogin = await DataRuntime.getQQLoginStatus();
    res.send({
        code: 0,
        message: 'success'
    });
}
export const QQGetQuickLoginListHandler: RequestHandler = async (req, res) => {
    const quickLoginList = await DataRuntime.getQQQuickLoginList();
    res.send({
        code: 0,
        data: quickLoginList
    });
}