const {respond} = require('../utils/utils');
const User = require('../models/user.model');
// const bcrypt = require('bcrypt');

const axios = require("axios");
const cheerio = require('cheerio');
const list = [];
module.exports.total = 0;
const fail = [];
const urlList = 'https://mangakakalot.com/manga_list?type=topview&category=all&state=all&page=';
const urlInfo = 'https://manganelo.com/manga/';
const urlChapter = 'https://manganelo.com/chapter/';

async function listPageMangaKakalot(page) {
    let result;
    try {
        result = await axios.get(urlList + page);
    } catch (e) {
        fail.push(page);
        return;
    }
    const $ =  cheerio.load(result.data);
    const htmlList = $('div[class="truyen-list"]');
    htmlList.find('.list-truyen-item-wrap > h3 > a').each(function (index, element) {
        const href = element.attribs.href;
        const id = href.substr(href.lastIndexOf('/') + 1);
        list.push({title: $(element).text(), id});
        module.exports.total++;
    });
}

async function listMangaKakalot() {
    let page = 1;

    let result = await axios.get(urlList + page);
    let $ =  cheerio.load(result.data);
    let maxPage = $('div[class="panel_page_number"] > div.group_page > a.page_blue.page_last').text();
    const regExp = /\(([^)]+)\)/;
    const matches = regExp.exec(maxPage);
    maxPage = matches[1];

    while (page < maxPage) {
        listPageMangaKakalot(page);
        page++;
    }

    var intervalId = setInterval(function(){
        var timoutId = setTimeout(function(){
            if (fail.length > 0) {
                fail.forEach((page, index, object) => {
                    object.splice(index, 1);
                    console.log(`Page ${page} failed, trying to fix it`);
                    listPageMangaKakalot(page);
                });
            }
        }, 10000);
    }, 10000);

    console.log(list);
}

String.prototype.removeLineCarriage = function() {
    return this.replace(/(\r\n|\n|\r)/gm, "");
};

String.prototype.removeBackSlash = function() {
    return this.replace(/\\/g, '');
};

module.exports.info = async (id) => {
    let result = await axios.get(urlInfo + id);
    let $ =  cheerio.load(result.data);

    const img = $('img', '.info-image').attr('src');
    const info = $('div[class="story-info-right"]');
    const table = info.find('table > tbody > tr').children();
    const title = info.find('h1').text();
    const alternative = $(table[1]).text();
    const author = $(table[3]).text().removeLineCarriage();
    const status = $(table[5]).text();
    const genres = $(table[7]).text().removeLineCarriage().split('-');

    const infoExtent = $('div[class="story-info-right-extent"]');
    const tableExtent = infoExtent.find('p').children();
    const updated = $(tableExtent[1]).text();
    const view = $(tableExtent[3]).text();
    const rating = $('#rate_row_cmd > em > em:nth-child(2) > em > em:nth-child(1)').text();

    const description = $('#panel-story-info-description').find('h3')[0].nextSibling.nodeValue.removeLineCarriage().removeBackSlash();

    const chapters = [];
    const chapterTable = $('ul[class="row-content-chapter"] > li').each(function(i, elm) {
        let chapter =  $(this).children();
        let number = parseInt($(chapter[0]).text().split(' ')[1]);
        let view = parseInt($(chapter[1]).text().replace(',', ''));
        let uploaded = $(chapter[2]).text();
        chapters.push({number, view, uploaded});
    });

    return {img, title, alternative, author, status, genres, updated, view, rating, description, chapters};
};

module.exports.chapter = async (id, chapter) => {
    let result = await axios.get(`${urlChapter}${id}/chapter_${chapter}`);
    let $ =  cheerio.load(result.data);

    const chapterContent = $('div[class="container-chapter-reader"]');

    const imgUrls = [];
    const img = chapterContent.find('img').each(function(i, elm) {
        imgUrls.push($(this).attr('src'));
    });

    return imgUrls;
};


// listMangaKakalot();

module.exports.list = list;
