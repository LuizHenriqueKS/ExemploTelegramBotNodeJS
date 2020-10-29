const axios = require('axios');

const baseUrl = 'https://api.telegram.org/bot';

module.exports = class TelBot {

    constructor(token) {
        this._token = token;
        this.validateAttrs();
    }

    validateAttrs() {
        if (!this._token) throw "Token inválido";
    }

    async sendMessage({ chatId, text }) {
        const url = getUrl.call(this, "/sendMessage");
        const response = await axios.post(url, { chat_id: chatId, text });
        return response.data;
    }

    async getUpdates(offset) {
        let url = getUrl.call(this, "/getUpdates");
        if (offset) {
            url += `?offset=${offset}`;
        }
        const response = await axios.get(url);
        const data = response.data;
        if (data.ok) {
            return data.result;
        } else {
            throw data;
        }
    }

    async getLastUpdates() {
        const returnUpdates = this._offset !== undefined;
        const updates = await this.getUpdates(this._offset);
        this._offset = updates.map(r => r.update_id).reduce((a, b) => Math.max(a, b), 0);
        if (this._offset > 0) this._offset++;
        return returnUpdates ? updates : [];
    }

}

function getUrl(path) {
    return baseUrl + this._token + path;
}
