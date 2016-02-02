import Ember from 'ember';
import Message from '../models/message';
export default Ember.Controller.extend({
	
	authSecret:"",
	authId:"",
	inbox: [],
	outbox: [],
	currentMessage: Message.create(),
	actions:{
		syncInbox: function(){
			var self = this;
			this.get("inbox").length = 0;
			Ember.$.ajax
				({
				  type: "GET",
				  url: "https://api.fonenode.com/v1/sms/inbox",
				  dataType: 'json',
				  async: false,
				  headers: {
				    "Authorization": "Basic " + btoa(this.get("authId") + ":" + this.get("authSecret"))
				  }
				}).then(function (response) {
			        response.data.forEach(function(item){
			        	self.get("inbox").pushObject(Message.create(item));
			        });
			      }, function (error) {
			      	alert(error.status+":"+error.statusText + " response: " + error.responseText);
			      });
		},

		syncOutbox: function(){
			var self = this;
			this.get("outbox").length = 0;
			Ember.$.ajax
				({
				  type: "GET",
				  url: "https://api.fonenode.com/v1/sms/outbox",
				  dataType: 'json',
				  async: false,
				  headers: {
				    "Authorization": "Basic " + btoa(this.get("authId") + ":" + this.get("authSecret"))
				  }
				}).then(function (response) {
			        response.data.forEach(function(item){
			        	self.get("outbox").pushObject(Message.create(item));
			        });
			      }, function (error) {
			        alert(error.status+":"+error.statusText + " response: " + error.responseText);
			      });
		},

		sendMockMessage:function(){
			var cMessage = this.get("currentMessage"),
			self = this;
			Ember.$.ajax
				({
				  type: "GET",
				  url: "https://api.fonenode.com/v1/sms_mock/inbound",
				  dataType: 'json',
				  async: false,
				  data:{from: cMessage.get("from"),to: cMessage.get("to"), text: cMessage.get("text") },
				  headers: {
				    "Authorization": "Basic " + btoa(this.get("authId") + ":" + this.get("authSecret"))
				  }
				}).then(function (response) {
			        self.send('syncInbox');
			      }, function (error) {
			        alert(error.status+":"+error.statusText + " response: " + error.responseText);
			      });
		}
	}
});
