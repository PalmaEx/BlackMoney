const salesRelatedPhrases = [
    // Fraze / Sensuri Romanesti
    'dm pentru vânzare', 'scrie-mi în privat pentru ofertă', 'am o promoție specială',
    'discount uriaș', 'reducere doar pentru tine', 'afacere de nerefuzat',
    'ocazie unică', 'lichidare de stoc', 'cel mai bun preț', 'cel mai bun pret', 'Cel mai bun preț', 'Cel mai bun pret',
    'promo exclusiv', 'deal imperdibil', 'lichidări de stoc', 'produs gratis', 'dau gratis',
    // Fraze / sensuri Englezesti
    'dm for sale', 'pm for offer', 'special promotion',
    'huge discount', 'personal discount', 'unbeatable deal',
    'unique opportunity', 'clearance', 'best price',
    'exclusive promo', 'irresistible deal', 'stock clearance', 'free product', 'giving away'
];

const salesRelatedMainWords = [
    // Cuvinte Romanesti
    'vânzare', 'ofertă', 'promoție', 'discount', 'reducere',
    'afacere', 'ocazie', 'lichidare', 'stoc', 'preț',
    'promo', 'deal', 'lichidări', 'gratis', 'dau',
    // Cuvinte Englezesti
    'sale', 'offer', 'promotion', 'discount', 'deal',
    'opportunity', 'clearance', 'stock', 'price',
    'promo', 'free', 'giveaway', 'bargain'
];

const specificSalesContextWords = ['dm', 'pm', 'privat', 'private'];

const salesRelatedWordsPatterns = salesRelatedMainWords.map(word => new RegExp(`\\b${word}\\b`, 'i'));
const salesRelatedPhrasesPatterns = salesRelatedPhrases.map(phrase => new RegExp(phrase.split(' ').map(word => `(${word})`).join('.*'), 'i'));

const specificSalesContextWordsPatterns = specificSalesContextWords.map(word => new RegExp(`\\b${word}\\b`, 'i'));

const whitelistRoleId = '1053211127615590423';

module.exports = (client) => {
    client.on('messageCreate', async (message) => {
        if (message.author.bot) return;

        if (message.member.roles.cache.has(whitelistRoleId)) return;

        const messageContentLower = message.content.toLowerCase();
        const detectedSalesPhrases = salesRelatedPhrasesPatterns.filter(pattern => pattern.test(messageContentLower));

        const messageWords = messageContentLower.split(/\s+/);
        const detectedSalesMainWords = messageWords.filter(word =>
            salesRelatedWordsPatterns.some(pattern => pattern.test(word))
        );

        const detectedSpecificSalesContextWords = messageWords.filter(word =>
            specificSalesContextWordsPatterns.some(pattern => pattern.test(word))
        );

        if (detectedSalesPhrases.length > 0 || (detectedSalesMainWords.length > 0 && detectedSpecificSalesContextWords.length > 0)) {
            console.log(`Sales-related language detected in message: ${message.content}`);
            console.log(`Detected phrases/words: ${[...detectedSalesPhrases, ...detectedSalesMainWords, ...detectedSpecificSalesContextWords].join(', ')}`);
            try {
                await message.delete();
                await message.channel.send(`${message.author}, mesajul tău conține cuvinte sau fraze legate de vânzări și a fost șters.\n\m **Mesajul șters:**\n\`\`\`${message.content}\`\`\`\n **__Te rugam sa iti reamintesti ca orice vanzare fara permisiune duce la ban, reciteste regulamentul!__**`);
            } catch (error) {
                console.error('Error deleting sales-related message:', error);
            }
        }
    });
};