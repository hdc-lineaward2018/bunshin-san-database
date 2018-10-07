'use strict';

const AWS = require("aws-sdk");
const uuidv1 = require('uuid/v1');

const dynamo = new AWS.DynamoDB.DocumentClient();

let table = "Book";
let lineuserid = "";
let name = "";
let bookid = "";

const putBookParam = {
    TableName: "",
    Item: {
        "bookid": "",
        "lineuserid": "",
        "name": "",
        "talklist": []
    }
};

const Book = {
    "lineuserid": "",
    "bookid": "",
    "name": ""
}


const createErrorResponse = (status, message, parameters) => {
    return {
        "status": status,
        "ErrorMessage": message,
        "Parameter": parameters
    };
};

exports.handler = (event, context, callback) => {

    // パスパラメータからクエリキーを取得
    lineuserid = event.lineuserid;

    // 必須 validation
    if (!lineuserid) {
        // 取得できなければエラーにする
        const response = createErrorResponse(
            400,
            "Bad Request. lineuserid is required.",
            {
                "lineuserid": lineuserid
            }
        );

        context.succeed(response);
        return;
    }

    // -------- DynamoDB レコード作成処理 ----------


    // 作成レコードのBookidを生成
    bookid = uuidv1();

    // name 指定
    if (event.name) {
        name = event.name;
    } else{
        name = "名称未設定";
    }

    putBookParam.TableName = table;
    putBookParam.Item.bookid = bookid;
    putBookParam.Item.lineuserid = lineuserid;
    putBookParam.Item.name = name;

    console.log("Adding a new item...");

    dynamo.put(putBookParam, function (err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));

            const response = createErrorResponse(
                500,
                "Internal server error. Could not create record.",
                {
                    "lineuserid": lineuserid
                }
            );

            context.succeed(response);
            return;

        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));

            Book.bookid = putBookParam.Item.bookid;
            Book.lineuserid = putBookParam.Item.lineuserid;
            Book.name = putBookParam.Item.name;

            context.succeed({"Book": Book});
            return;
        }
    });
};