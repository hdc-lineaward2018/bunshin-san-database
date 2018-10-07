/*
 * Function名:  AddTalkFunction
 * Author:      masaki.okabe
 */

'use strict';

const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();

const createErrorResponse = (status, message, parameters) => {
    return {
        "status": status,
        "ErrorMessage": message,
        "Parameter": parameters
    };
};

exports.handler = (event, context, callback) => {

    let lineuserid = "";
    let bookid = "";
    let talklist = [] ;

    const putBookParam = {
        TableName: "Book",
        Item: {
            "bookid": "",
            "lineuserid": "",
            "talklist": []
        }
    };

    // パスパラメータを取得
    lineuserid = event.lineuserid;
    bookid = event.bookid;
    talklist = event.talklist;

    // 必須 validation
    if (!lineuserid || !bookid) {
        // 取得できなければエラーにする
        const response = createErrorResponse(
            400,
            "Bad Request. lineuserid and bookid is required.",
            {
                "lineuserid": lineuserid,
                "bookid": bookid,
                "talklist": talklist
            }
        );

        context.succeed(response);
        return;
    }

    // -------- DynamoDB レコード作成処理 ----------

    var param = {
        TableName : "Book",
        FilterExpression : "lineuserid = :lineuserid AND bookid = :bookid",
        ExpressionAttributeValues : {":lineuserid" : lineuserid, ":bookid" : bookid}
    };

    console.log("scan item with parameter " + JSON.stringify(param));

    // ブック情報を取得しトークリストの末尾にトークを追加して更新する
    dynamo.scan(param, function(err, data) {
        if (err) {
            console.error("Unable scan item. Error JSON:", JSON.stringify(err, null, 2));

            const response = createErrorResponse(
                500,
                "Internal server error. Could not create record.",
                {
                    "lineuserid": lineuserid,
                    "bookid": bookid,
                    "talklist": talklist
                }
            );

            context.succeed(response);
            return;
        } else {

            //　更新用 const 作成
            putBookParam.Item.bookid = data.Items[0].bookid;
            putBookParam.Item.lineuserid = data.Items[0].lineuserid;
            // putBookParam.Item.talklist = data.Items[0].talklist;    
            var newTalkList = data.Items[0].talklist;
            talklist.forEach(function( talk ) {
                newTalkList.push(talk);
            });
            putBookParam.Item.talklist = newTalkList;

            dynamo.put(putBookParam, function (err, data) {
                if (err) {
                    console.error("Unable to put item. Error JSON:", JSON.stringify(err, null, 2));

                    const response = createErrorResponse(
                        500,
                        "Internal server error. Could not create record.",
                        {
                            "lineuserid": lineuserid,
                            "bookid": bookid,
                            "talklist": talklist
                        }
                    );

                    context.succeed(response);
                    return;

                } else {
                    console.log("Added item:", JSON.stringify(data, null, 2));

                    context.succeed({});
                    return;
                }
            });
        }
    });

};
