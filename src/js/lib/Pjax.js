import _ from 'lodash';
import 'whatwg-fetch';
import EventEmitter from "eventemitter2";

export default class Pjax extends EventEmitter {

    constructor (opts = {}) {
      super();
      this.link = document.querySelectorAll(opts.link || 'a');
      this.areaSelector = opts.area || 'body';
      this.area = document.querySelector(this.areaSelector);
      this.EVENT = {
        COMPLETE: "pjax:complete"
      };
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
          this.emit(this.EVENT.COMPLETE);
        });
    }


    backState(url) {
      fetch(url)
        .then(res => res.text())
        .then(text => this.parseHTML(text))
        .then(html => this.replaceContent(html, this.area))
        .then(() => {
          this.emit(this.EVENT.COMPLETE);
        });
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
