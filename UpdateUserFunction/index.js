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


    var putUserParam = {
        TableName:"User",
        Key:{
            "lineuserid": ""
        },
        UpdateExpression: "set lineuserid = :lineuserid",
        ExpressionAttributeValues:{
        },
        ReturnValues:"UPDATED_NEW"
    };

    const User = {
        "lineuserid": "",
        "username":"",
        "currentbookid":"",
        "editbookid":""
    }


    // requestパラメータ
    User.lineuserid = event.lineuserid;
    User.username = event.username;
    User.currentbookid = event.currentbookid;
    User.editbookid = event.editbookid;

    // 必須 validation
    if (!User.username && !User.currentbookid && !User.editbookid) {
        // 取得できなければエラーにする
        const response = createErrorResponse(
            400,
            "Bad Request. Need at least one column to update.",JSON.stringify(User)
        );

        context.succeed(response);
        return;
    }

    // -------- DynamoDB User レコード作成処理 ----------


    var putUserParam = {
        TableName:"User",
        Key:{
            "lineuserid": ""
        },
        UpdateExpression: "set ",
        ExpressionAttributeValues:{
        },
        ReturnValues:"UPDATED_NEW"
    };

    // Userレコード生成
    // 必須項目
    putUserParam.Key.lineuserid = User.lineuserid;

    // 更新対象のものだけproperty追加
    let addedFlag = false;
    if(User.username){
        putUserParam.UpdateExpression = putUserParam.UpdateExpression + "username = :username";
        putUserParam.ExpressionAttributeValues[":username"] = User.username;

        addedFlag = true;
    }
    if(User.currentbookid){
        if(addedFlag){ putUserParam.UpdateExpression = putUserParam.UpdateExpression + " , ";}
        putUserParam.UpdateExpression = putUserParam.UpdateExpression + "currentbookid = :currentbookid";
        putUserParam.ExpressionAttributeValues[":currentbookid"] = User.currentbookid;

        addedFlag = true;
    }

    if(User.editbookid){
        if(addedFlag){ putUserParam.UpdateExpression = putUserParam.UpdateExpression + " , ";}
        putUserParam.UpdateExpression = putUserParam.UpdateExpression + "editbookid = :editbookid";
        putUserParam.ExpressionAttributeValues[":editbookid"] = User.editbookid;

        addedFlag = true;
    }

    console.log("Updating an item...");
    console.log("parameter is " + JSON.stringify(putUserParam));

    dynamo.update(putUserParam, function (err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));

            const response = createErrorResponse(
                500,
                "Internal server error. Could not create User record.",
                JSON.stringify(User)
            );

            context.succeed(response);
            return;

        } else {
            console.log("Updated User item:", JSON.stringify(data, null, 2));

            context.succeed({"User": putUserParam.Item});
            return
        }
    });
};