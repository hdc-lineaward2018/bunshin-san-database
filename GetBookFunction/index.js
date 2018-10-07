'use strict';

var AWS = require("aws-sdk");
var dynamo = new AWS.DynamoDB.DocumentClient();

const createResponse = (status, message) => {
    return {
        "status": status,
        "message": message
    };
};

exports.handler = (event, context, callback) => {
    // パスパラメータからクエリキーを取得
    let lineuserid = event.lineuserid;
    let bookid = event.bookid;

    if (!lineuserid || !bookid) {
        // 取得できなければエラーにする
        // const response = createResponse({400, 'Bad Request. lineuserid  and bookid are required.');
        const response = {
            "status": 400,
            "ErrorMessage": "Bad Request. ineuserid and bookid are required.",
            "Parameter":{
                "lineuserid":lineuserid,
                "bookid":bookid
            }
        }
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