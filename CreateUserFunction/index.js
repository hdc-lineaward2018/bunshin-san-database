'use strict';

const AWS = require("aws-sdk");
const uuidv1 = require('uuid/v1');

const dynamo = new AWS.DynamoDB.DocumentClient();

let lineuserid = "";
let username = "";
let bookname = "名称未設定";

const putBookParam = {
    TableName: "Book",
    Item: {
        "bookid": "",
        "lineuserid": "",
        "name": "",
        "talklist": []
    }
};

const putUserParam = {
    TableName: "User",
    Item: {
        "lineuserid": "",
        "name": "",
        "editbookid": "",
        "currentbookid": ""
    }
};

const User = {
    "lineuserid": "",
    "name": "",
    "currentbookid": "",
    "editbookid": ""
}


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
    username = event.name;

    // 必須 validation
    if (!lineuserid || !username) {
        // 取得できなければエラーにする
        const response = createErrorResponse(
            400,
            "Bad Request. lineuserid and name are required.",
            {
                "lineuserid": lineuserid,
                "name": username
            }
        );

        context.succeed(response);
        return;
    }

    // -------- DynamoDB Book レコード作成処理 ----------

    // Bookレコード生成
    putBookParam.Item.bookid = uuidv1();
    putBookParam.Item.lineuserid = lineuserid;
    putBookParam.Item.name = bookname;

    console.log("Adding a new book item...");

    dynamo.put(putBookParam, function (err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));

            const response = createErrorResponse(
                500,
                "Internal server error. Could not create Book record.",
                {
                    "lineuserid": lineuserid,
                    "name": username
                }
            );

            context.succeed(response);
            return;

        } else {
            console.log("Added Book item:", JSON.stringify(data, null, 2));

            Book.bookid = putBookParam.Item.bookid;
            Book.lineuserid = putBookParam.Item.lineuserid;
            Book.name = putBookParam.Item.name;

        }
    });


    // -------- DynamoDB User レコード作成処理 ----------

    // Userレコード生成
    putUserParam.Item.lineuserid = lineuserid;
    putUserParam.Item.name = username;
    putUserParam.Item.currentbookid = putBookParam.Item.bookid;
    putUserParam.Item.editbookid = putBookParam.Item.bookid;

    console.log("Adding a new  item...");
    console.log("parameter is " + JSON.stringify(putUserParam));

    dynamo.put(putUserParam, function (err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));

            const response = createErrorResponse(
                500,
                "Internal server error. Could not create User record.",
                {
                    "lineuserid": lineuserid,
                    "name": username
                }
            );

            context.succeed(response);
            return;

        } else {
            console.log("Added User item:", JSON.stringify(data, null, 2));

            context.succeed({"User": putUserParam.Item});
            return
        }
    });
};