/*
 * Function名:  GetUserFunction
 * Author:      masaki.okabe
 */

'use strict';

var AWS = require("aws-sdk");
var dynamo = new AWS.DynamoDB.DocumentClient();

const createErrorResponse = (status, message, parameters) => {
    return {
        "status": status,
        "ErrorMessage": message,
        "Parameter": parameters
    };
};

exports.handler = (event, context, callback) => {
    // パスパラメータからクエリキーを取得
    let lineuserid = event.lineuserid;

    if (!lineuserid ) {
        // 取得できなければエラーにする
        const response = createErrorResponse(
            400,
            "Bad Request. ineuserid are required.",
            {
                "lineuserid":lineuserid
            }
        );
        context.succeed(response);
        return;
    }

    var param = {
        TableName : "User",
        FilterExpression : "lineuserid = :val",
        ExpressionAttributeValues : {":val" : lineuserid}
    };

    dynamo.scan(param, function(err, data) {
        if (err) {
            console.log("エラー = " + err);
            context.fail(err); // エラー時

        } else {
            console.log("成功 = " + data);
            context.succeed(data); // 正常時
        }
    });

};