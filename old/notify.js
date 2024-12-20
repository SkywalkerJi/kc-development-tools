$(function () {
  let $notice = $(".notice");
  for (let i = 0; i < $notice.length; ++i)
    $notice[i].onclick = function () {
      alert(this.title);
    };
});
