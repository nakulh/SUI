import AWS from 'aws-sdk';
AWS.config.update({ region: "us-west-2" });
const ddb = new AWS.DynamoDB.DocumentClient()

export const getAllSubscribersToWallet = (walletAddress, cb) => {
    const params = {
        TableName: 'SubscribedProject',
        IndexName: 'ProjectSubscriber',
        KeyConditionExpression: 'project_name = :x',
        ExpressionAttributeValues: {
            ':x': walletAddress
        },
        ProjectionExpression: 'subscriber_id, subscriber_platform'
    }

    ddb.query(params, function (err, data) {
        const list = [];
        if (err) {
          console.log("Error", err);
          cb(null, err);
        } else {
            data.Items.forEach((item) => {
                list.push({
                    platform: item.subscriber_platform,
                    id: item.subscriber_id
                })
            })
            cb(list, err);
        }
      });
}

getAllSubscribersToWallet("abcd", (res) => {
    console.log(res);
});