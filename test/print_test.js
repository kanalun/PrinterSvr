var request=require('request');
var data =[
	{
        "id": "12222222222222",//打印任务ID
        "group_id": "2222221",//打印队列ID
        "printer": "192.168.123.100:9100",//打印机别名
        "content": "<% barcode:(123, CODE39 , 130 , 30, OFF , A) %>"
	}//

    //<% setAlign:c %>居中文本<% setSize:2 %>这里开始是放大\n<% setSize:1 %>恢复正常大小<% setAlign:l %>\n" +
    //" <% qrcode:1,'\\x0f','\\x04','\\x00' %>
]
var options = {
    url: 'http://192.168.123.101:9200/printerstatus',
    method: 'POST',
    json:true,
    body: data
};
function callback(error, response, data) {
    if (!error && response.statusCode == 200) {
        console.log('----info------',data);
    }
}
request(options, callback);


