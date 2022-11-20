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
	let q = Array.from(text.matchAll(/ "([a-zA-Z0-9 ]*)" /g), m => m[1]);

	// wekan webhook docs: https://github.com/wekan/wekan/wiki/Webhook-data
	
	let title = {
		"act-createCard": `:pencil2: created card`,
		//"act-createCard": `created card **"${q[0]}"** in list *${q[1]} (${q[2]})*`,
		//"act-moveCard": `*${user}* moved card **"${q[0]}"** moved from *${q[2]}* to *${q[4]}*`,
		"act-moveCard": `:left_right_arrow: moved card`,
	}[data.description];

	let desc = {
		"act-createCard": `in **${q[2]}**`,
		"act-moveCard": `**${q[2]}** :arrow_right: **${q[4]}**`,
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
