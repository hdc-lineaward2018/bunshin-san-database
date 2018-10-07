/*
 * Function名:  GetBookFunction
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
    let bookid = event.bookid;

    if (!lineuserid || !bookid) {
        // 取得できなければエラーにする
        const response = createErrorResponse(
            400,
            "Bad Request. ineuserid and bookid are required.",
            {
                "lineuserid":lineuserid,
                "bookid":bookid
            }
        );
        callback(response);
        return;
    }

    var param = {
        TableName : "Book",
        FilterExpression : "lineuserid = :lineuserid AND bookid = :bookid",
        ExpressionAttributeValues : {":lineuserid" : lineuserid, ":bookid" : bookid}
    };

    dynamo.scan(param, function(err, data) {
        if (err) {
            console.log("エラー = " + err);
            context.fail(err); // エラー時

        } else {
            console.log("成功1 = " + data);


            dynamo.scan(param, function(err2, data2) {
                if (err) {
                    console.log("エラー = " + err2);
                    context.fail(err); // エラー時

                } else {
                    console.log("成功2 = " + data2);

                    context.succeed(data); // 正常時
                }
            });

        }
    });

};