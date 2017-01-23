import Pjax from './lib/Pjax';


const pjax = new Pjax({
  link: ".js-pjax",
  area: "article",
});

pjax.on("pjax:complete", () => {
  console.log("changed!");
});
