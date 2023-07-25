const { Client, Intents } = require('discord.js');

const { Client, Intents } = require('discord.js');

const { Octokit } = require('octokit');


const organization = "sosyal-app";


const botToken = process.env.DISCORD_KEY;
const chatId = process.env.DISCORD_CHAT_ID;

// Gerekli Gateway Intentleri burada belirtiliyor
const botIntents = new Intents([
    Intents.FLAGS.GUILDS, // Sunucular ve kanallarla ilgili bilgiler burada tutuluyor
    Intents.FLAGS.GUILD_MESSAGES, // Mesajlar ve mesaj etkinlikleri için
  ]);
  
const client = new Client({ intents: botIntents });


const octokit = new Octokit();

client.once('ready', () => {
  console.log('Bot hazır!');
});

client.login(botToken);

async function checkForUpdates() {
  try {
   
    const { data: repos } = await octokit.repos.listForOrg({
      org: organization,
      per_page: 100, 
    });

    
    for (const repo of repos) {
      const { data } = await octokit.repos.listCommits({
        owner: organization,
        repo: repo.name,
        per_page: 1,
      });

      if (data.length > 0) {
        const latestCommit = data[0];
        const message = `Yeni bir commit yapıldı!\nRepo: ${repo.name}\nBaşlık: ${latestCommit.commit.message}\nLink: ${latestCommit.html_url}`;

        const channel = client.channels.cache.get(process.env.DISCORD_CHAT_ID); 
        channel.send(message);
      }
    }
  } catch (error) {
    console.error('GitHub API hatası:', error.message);
  }
}


const interval = 60000; 
setInterval(checkForUpdates, interval);

