import _ from 'lodash';
import 'whatwg-fetch';

export default class Pjax {

    constructor (opts = {}) {
      this.link = document.querySelectorAll(opts.link || 'a');
      this.areaSelector = opts.area || 'body';
      this.area = document.querySelector(this.areaSelector);

      this.initListener();
    }


    initListener() {
      _.forEach(this.link, (l, i) => {
        l.addEventListener("click", evt => {
          evt.preventDefault();
          this.changeState(evt.target.href);
        });
      });
      window.addEventListener("popstate", evt => {
        evt.preventDefault();
        this.backState(location.pathname);
      });
    }


    changeState(url) {
      fetch(url)
        .then(res => res.text())
        .then(text => this.parseHTML(text))
        .then(html => this.replaceContent(html, this.area))
        .then(() => {
          window.history.pushState(null, null, url);
        });
    }


    backState(url) {
      fetch(url)
        .then(res => res.text())
        .then(text => this.parseHTML(text))
        .then(html => this.replaceContent(html, this.area));
    }


    parseHTML(text) {
      return new Promise(resolve => {
        const html = document.createElement('html');
        html.innerHTML = text;
        resolve(html);
      });
    }


    replaceContent(html, area) {
      const targetArea = html.querySelector(this.areaSelector);
      const parentArea = this.area.parentNode;
      parentArea.replaceChild(targetArea, this.area);
      this.area = targetArea;
    }

};
