'use strict';

const app = require('express')();
const bodyParser = require('body-parser');
const { MessageEmbed, WebhookClient } = require('discord.js');

let PORT = process.env['PORT'] || 10080;

function formatEmbed(data) {
	let user = data.user;
	let card = `${data.card} [{${data.cardId}]`;

	let text = data.text.split('\n')[0];
	let actionLink = data.text.split('\n')[1];

	let words = text.slice(user.length + 1, text.length).split(' ');
	let q = Array.from(text.matchAll(/ "([a-zA-Z0-9.-_*<=>@+?^${}()|[\]\\ ]*)" /g), m => m[1]);

	// FOR TESTING PURPOSES :
	
	for(let i=0; i<q.length; i++){
		console.log(q[i]);
	}
	// ------------------------------

	// wekan webhook docs: https://github.com/wekan/wekan/wiki/Webhook-data
	 
	//"act-moveCard": card 0 ; board 1 ; oldList 2 ; oldSwimlane 3 ; list 4 ; swimlane 5
	//"act-createCard" : card 0 ; list 1 ; swimlane 2 ; board 3;

	let title = {
		"act-createCard": ':pencil2: created card',
		"act-moveCard": ':left_right_arrow: moved card',
	}[data.description];

	let desc = {
		"act-createCard": `*${data.card}*\n in **${q[1]}**`,
		"act-moveCard": `*${data.card}*\n **${q[2]}** :arrow_right: **${q[4]}**`,
	}[data.description];

	let embed = new MessageEmbed()
		.setAuthor( {name: `${user}`})
		.setTitle(title)
		.setURL(actionLink)
		.setDescription(desc)
		.setColor('#e2bb1e')
	;

	return embed;
}

// types:
// cards
// card content
// board
// lists
// swimlane

app.use(bodyParser.json());

app.get("/healthz", (_, res) => { res.status(200).end() } );

app.post("/api/webhooks/:id/:token", (req, res) => {
	console.log("Responding to webhook, text: " + req.body.text.split('\n')[0]);

	var id = req.params.id;
	var token = req.params.token;
	let webhookClient = new WebhookClient({ id: id, token: token });

	let embed = formatEmbed(req.body);

	webhookClient.send({
		username: 'Wekan',
		embeds: [embed],
	});

	res.status(200).end();
});

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
