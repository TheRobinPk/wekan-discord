[gh-issues]: https://github.com/mibmo/wekan-discord/issues
[gh-issues-submit]: https://github.com/mibmo/wekan-discord/issues/new
[container-file]: https://github.com/mibmo/wekan-discord/blob/main/Containerfile
[container-image]: https://github.com/mibmo/wekan-discord/pkgs/container/wekan-discord
[docker]: https://docker.com
[podman]: https://podman.io
[kubernetes]: https://kubernetes.io
[kustomize]: https://kustomize.io
[pm2]: https://pm2.io

# wekan-discord
Wekan webhook middleware that formats as pretty Discord embeds.
Discord webhook middleware to format Wekan events.


## How does it work?
wekan-discord intercepts the Wekan event and formats it as pretty Discord embeds.

<center>

| Direct | wekan-discord |
| - | - |
| ![direct card creation](direct-create-card.png) | ![bridge card creation](bridge-create-card.png)
| ![direct card moving](direct-move-card.png)     | ![bridge card moving](bridge-move-card.png)
</center>

## Usage
You need two things: a discord channel and a wekan board.

To start off, head to your Discord channel's settings, then navigate to `Integrations` and press `Create Webhook`.
Give it an appropriate name (such as `Wekan`) and copy the webhook URL.

![Creating the outgoing webhook in Wekan](discord-webhook.png)

Then head to your Wekan board's settings and go into the `Outgoing Webhooks` menu.
From there, create a webhook.
The URL for the webhook is the webhook URL you copied from Discord, except replace the `discord.com` with your wekan-discord instance's URL (such as `wekan-discord.mib.dev`).
Name and token don't matter, but do note that it is a one-way webhook.

![Creating the outgoing webhook in Wekan](wekan-webhook.png)

Upon creating the webhook, you should start seeing bridged events.
If not, please double & triple-check your setup and if the errors persist then [check if anyone has had similar issues][gh-issues].
If you're unable to find a resolution, please [submit an issue][gh-issues-submit].

## Self-hosting
There are several options for hosting.
Though using a container orchestrator is the recommended way to deploy wekan-discord, there are several options.

### [Docker][docker] / [Podman][podman]
The container image can be deployed as
```sh
docker run --rm -p 8080:10080 ghcr.io/mibmo/wekan-discord:latest
```

A [compose file](https://docs.docker.com/compose/compose-file) can also be found in [`deploy/compose.yaml`](/deploy/compose.yaml)

### [Kubernetes][kubernetes] via [kustomize][kustomize]
A wekan-discord instance can be deployed to Kubernetes using kustomize.
The kustomize configuration is available in [`deploy/kustomize`](/deploy/kustomize), and can be deployed using `kubectl apply -k deploy/kustomize`.

### [pm2][pm2]
If not already installed, do so by following the [quick start](https://pm2.keymetrics.io/usage/quick-start#installation).

The application can then be created with
```sh
pm2 start src/main.js \
	--name wekan-discord \
	--log wekan-discord.log
```

Realtime monitoring is then available using `pm2 monit`.

### systemd

## Privacy
Data logged by a wekan-discord instance is as follows:
- Timestamp
- Discord channel ID

Data is logged only for debugging purposes.
If deemed unacceptable, an instance can be [self-hosted](#self-hosting) using the provided [container file][container-file] or [container image][container-image].
