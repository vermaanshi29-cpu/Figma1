const PROJECTS = [
  { img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=70", title: "How To Make Flyer Design" },
  { img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=70", title: "How To Make Flyer Design" },
  { img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=70", title: "How To Make Flyer Design" },
  { img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=70", title: "How To Make Flyer Design" },
  { img: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=70", title: "How To Make Flyer Design" },
  { img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=70", title: "How To Make Flyer Design" }
];
const PROJECT_DESC = "Lorem Ipsum Dolor Sit Amet, Consec Adipiscing Elit Aed And Lorem Ipsum...";
const PROJECT_TAGS = ["Typescript", "React.Js", "Next.Js", "CSS", "HTML", "MongoDB"];

const RECO_TEXT = "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Vitae Nulla Diam In Ac Dictum A Urna Viverra Morbi. Morbi Donec Amet....";
const RECOMMENDATIONS = [
  { title: "Great Quality!", name: "James Gouse",     role: "Graphic Designer", img: "https://randomuser.me/api/portraits/men/32.jpg" },
  { title: "Amazing Work!",  name: "Tiana Philips",   role: "Photographer",     img: "https://randomuser.me/api/portraits/women/44.jpg" },
  { title: "Great Quality!", name: "Talan Westervelt", role: "Business Man",    img: "https://randomuser.me/api/portraits/men/75.jpg" },
  { title: "Super Fast!",    name: "Maria Lopez",     role: "Product Manager",  img: "https://randomuser.me/api/portraits/women/68.jpg" },
  { title: "Highly Recommended!", name: "David Chen", role: "Startup Founder",  img: "https://randomuser.me/api/portraits/men/46.jpg" },
  { title: "Great Communication!", name: "Sara Khan", role: "UX Researcher",    img: "https://randomuser.me/api/portraits/women/12.jpg" },
  { title: "Excellent Developer!", name: "Leo Martin", role: "CTO",             img: "https://randomuser.me/api/portraits/men/11.jpg" }
];

$(function () {
  const tagsHtml = PROJECT_TAGS.map(t => `<span>${t}</span>`).join("");
  $(".projects-grid").html(PROJECTS.map(p => `
    <article class="project-card card">
      <img src="${p.img}" alt="${p.title}" loading="lazy" />
      <div class="project-body">
        <h3>${p.title}</h3>
        <p>${PROJECT_DESC}</p>
        <div class="tags">${tagsHtml}</div>
      </div>
    </article>`).join(""));

  $(".carousel-track").html(RECOMMENDATIONS.map((r, i) => `
    <div class="slide" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${RECOMMENDATIONS.length}">
      <article class="reco-card card">
        <div class="stars" aria-label="5 out of 5 stars">★★★★★</div>
        <h3>${r.title}</h3>
        <p>${RECO_TEXT}</p>
        <div class="reviewer">
          <img src="${r.img}" alt="${r.name}" loading="lazy" />
          <div><strong>${r.name}</strong><small>${r.role}</small></div>
        </div>
      </article>
    </div>`).join(""));

  const $viewport = $(".carousel-viewport");
  const $track = $(".carousel-track");
  const $slides = $track.children(".slide");
  const $dots = $(".carousel-dots");
  const total = $slides.length;
  let perView = 3, index = 0, timer = null;

  function getPerView() {
    const w = $(window).width();
    if (w <= 600) return 1;
    if (w <= 960) return 2;
    return 3;
  }

  function maxIndex() { return Math.max(0, total - perView); }

  function buildDots() {
    $dots.empty();
    for (let i = 0; i <= maxIndex(); i++) {
      $("<button>", { type: "button", role: "tab", "aria-label": `Go to slide ${i + 1}` })
        .data("i", i).appendTo($dots);
    }
  }

  function layout() {
    perView = getPerView();
    $slides.css("width", $viewport.width() / perView + "px");
    buildDots();
    goTo(Math.min(index, maxIndex()), false);
  }

  function goTo(i, animate = true) {
    const max = maxIndex();
    index = i > max ? 0 : i < 0 ? max : i;
    $track.css("transition", animate ? "" : "none");
    $track.css("transform", `translateX(${-index * $slides.first().outerWidth()}px)`);
    $dots.children().removeClass("active").attr("aria-selected", "false")
      .eq(index).addClass("active").attr("aria-selected", "true");
  }

  function startAuto() { stopAuto(); timer = setInterval(() => goTo(index + 1), 4000); }
  function stopAuto() { clearInterval(timer); }

  $dots.on("click", "button", function () { goTo($(this).data("i")); startAuto(); });
  $(".carousel").on("mouseenter", stopAuto).on("mouseleave", startAuto);

  let startX = null;
  $viewport.on("pointerdown", e => { startX = e.clientX; stopAuto(); });
  $(window).on("pointerup", e => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 40) goTo(index + (dx < 0 ? 1 : -1));
    startX = null;
    startAuto();
  });

  $(".carousel").attr("tabindex", 0).on("keydown", e => {
    if (e.key === "ArrowRight") goTo(index + 1);
    if (e.key === "ArrowLeft") goTo(index - 1);
  });

  let resizeTimer;
  $(window).on("resize", () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(layout, 120); });

  index = 1;
  layout();
  startAuto();

  $(".nav-toggle").on("click", function () {
    const open = !$(".nav").hasClass("open");
    $(".nav").toggleClass("open", open);
    $(this).toggleClass("open", open).attr("aria-expanded", open);
  });
  $(".nav a").on("click", function () {
    $(".nav a").removeClass("active");
    $(this).addClass("active");
    $(".nav, .nav-toggle").removeClass("open");
    $(".nav-toggle").attr("aria-expanded", false);
  });

  const sectionIds = ["home", "projects", "recommendations", "contact"];
  $(window).on("scroll", function () {
    const y = $(window).scrollTop() + 120;
    let current = "home";
    sectionIds.forEach(id => { const $s = $("#" + id); if ($s.length && $s.offset().top <= y) current = id; });
    $(".nav a").removeClass("active").filter(`[href="#${current}"]`).addClass("active");
  });

  $(".contact-form").on("submit", function (e) {
    e.preventDefault();
    const $form = $(this);
    const $name = $form.find("[name=name]");
    const $email = $form.find("[name=email]");
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($email.val().trim());
    const nameOk = $name.val().trim() !== "";

    $name.toggleClass("invalid", !nameOk);
    $email.toggleClass("invalid", !emailOk);

    const $status = $form.find(".form-status").removeClass("ok err");
    if (!nameOk || !emailOk) {
      $status.addClass("err").text("Please enter your name and a valid email.");
      return;
    }
    $status.addClass("ok").text(`Thanks, ${$name.val().trim()}! Your message has been noted.`);
    this.reset();
  });
  $(".contact-form input").on("input", function () { $(this).removeClass("invalid"); });
});