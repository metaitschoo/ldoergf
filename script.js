/**
 * IT ACADEMY LANDING PAGE - PURE JAVASCRIPT
 * No external libraries or frameworks.
 */

// ================= TELEGRAM BOT CONFIGURATION =================
const TELEGRAM_CONFIG = {
  token: "9296353079:AAFW2u3F5vCof71AOCqOpANR5O6N-kc5sBc",
  chatId: "-1003864031158"
};

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initPhoneMask();
  initCourseSelector();
  initFaqAccordion();
  initStatsCounter();
  initFormHandler();
  initModal();
});

// ================= 1. NAVBAR & MOBILE MENU =================
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");

  // Sticky background on scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
    updateActiveNavLink();
  });

  // Mobile menu toggle
  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      menuToggle.classList.toggle("active");
      navMenu.classList.toggle("active");
      document.body.style.overflow = navMenu.classList.contains("active") ? "hidden" : "";
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        menuToggle.classList.remove("active");
        navMenu.classList.remove("active");
        document.body.style.overflow = "";
      });
    });
  }

  // Active section indicator on scroll
  function updateActiveNavLink() {
    const sections = document.querySelectorAll("section[id]");
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute("id");
      const targetLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (targetLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(l => l.classList.remove("active"));
          targetLink.classList.add("active");
        }
      }
    });
  }
}

// ================= 2. TELEFON RAQAM FORMATLASH (MASK) =================
function initPhoneMask() {
  const phoneInput = document.getElementById("phoneNumber");
  if (!phoneInput) return;

  phoneInput.addEventListener("focus", () => {
    if (!phoneInput.value.trim()) {
      phoneInput.value = "+998 ";
    }
  });

  phoneInput.addEventListener("input", (e) => {
    let inputVal = e.target.value;
    
    // Raqamlarni ajratib olish
    let digits = inputVal.replace(/\D/g, "");

    // Agar 998 bilan boshlanmasa yoki bo'sh bo'lsa
    if (!digits.startsWith("998")) {
      digits = "998" + digits;
    }

    // 12 ta raqam bilan cheklash (998 + 9 xonali telefon)
    digits = digits.substring(0, 12);

    // Format: +998 (XX) XXX-XX-XX
    let formatted = "+";
    if (digits.length > 0) {
      formatted += digits.substring(0, 3); // 998
    }
    if (digits.length > 3) {
      formatted += " (" + digits.substring(3, 5); // (XX
    }
    if (digits.length >= 5) {
      formatted += ") ";
    }
    if (digits.length > 5) {
      formatted += digits.substring(5, 8); // XXX
    }
    if (digits.length > 8) {
      formatted += "-" + digits.substring(8, 10); // -XX
    }
    if (digits.length > 10) {
      formatted += "-" + digits.substring(10, 12); // -XX
    }

    e.target.value = formatted;
  });

  phoneInput.addEventListener("keydown", (e) => {
    // Agar foydalanuvchi Backspace bosganda +998 ni o'chirib yubormasligi uchun
    if (e.key === "Backspace" && phoneInput.value.length <= 5) {
      e.preventDefault();
    }
  });
}

// ================= 3. KURSLAR KARTASIDAN FORMGA YO'NALTIRISH =================
function initCourseSelector() {
  const selectBtns = document.querySelectorAll(".select-course-btn");
  const courseSelect = document.getElementById("courseDirection");
  const registerSection = document.getElementById("register");

  selectBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const courseName = btn.getAttribute("data-course");
      if (courseSelect && courseName) {
        courseSelect.value = courseName;
      }
      
      if (registerSection) {
        registerSection.scrollIntoView({ behavior: "smooth" });
        // Kurs tanlanganini bildiruvchi animatsiya
        courseSelect.focus();
        courseSelect.parentElement.classList.add("highlight-pulse");
        setTimeout(() => {
          courseSelect.parentElement.classList.remove("highlight-pulse");
        }, 1500);
      }
    });
  });
}

// ================= 4. FAQ ACCORDION =================
function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(item => {
    const questionBtn = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    questionBtn.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // Barcha ochiqlarini yopish
      faqItems.forEach(i => {
        i.classList.remove("active");
        i.querySelector(".faq-answer").style.maxHeight = null;
      });

      // Agar ochiq bo'lmagan bo'lsa, ochish
      if (!isActive) {
        item.classList.add("active");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });
}

// ================= 5. STATISTIKA RAQAMLAR ANIMATSIYASI =================
function initStatsCounter() {
  const statNumbers = document.querySelectorAll(".stat-number");
  let animated = false;

  function runCounter() {
    statNumbers.forEach(counter => {
      const target = +counter.getAttribute("data-target");
      const isPercent = counter.innerText.includes("%");
      const isPlus = counter.innerText.includes("+");
      let count = 0;
      const speed = 40;
      const step = Math.ceil(target / speed);

      const updateCount = () => {
        count += step;
        if (count < target) {
          counter.innerText = count.toLocaleString() + (isPlus ? "+" : "") + (isPercent ? "%" : "");
          setTimeout(updateCount, 25);
        } else {
          counter.innerText = target.toLocaleString() + (isPlus ? "+" : "") + (isPercent ? "%" : "");
        }
      };

      updateCount();
    });
  }

  // Scroll orqali ko'ringanda ishga tushirish
  window.addEventListener("scroll", () => {
    const statsSection = document.querySelector(".stats-section");
    if (!statsSection || animated) return;

    const rect = statsSection.getBoundingClientRect();
    if (rect.top <= window.innerHeight && rect.bottom >= 0) {
      runCounter();
      animated = true;
    }
  });
}

// ================= 6. FORM TEKSHIRISH VA TELEGRAMGA YUBORISH =================
function initFormHandler() {
  const form = document.getElementById("studentRegisterForm");
  const submitBtn = document.getElementById("submitBtn");
  const btnText = submitBtn.querySelector(".btn-text");
  const btnIcon = submitBtn.querySelector(".btn-icon");
  const btnSpinner = submitBtn.querySelector(".btn-spinner");
  const formAlert = document.getElementById("formAlert");

  const firstNameInput = document.getElementById("firstName");
  const lastNameInput = document.getElementById("lastName");
  const studentAgeInput = document.getElementById("studentAge");
  const courseDirectionInput = document.getElementById("courseDirection");
  const phoneNumberInput = document.getElementById("phoneNumber");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 1. Validatsiyadan o'tkazish
    const isValid = validateForm();
    if (!isValid) return;

    const formData = {
      firstName: firstNameInput.value.trim(),
      lastName: lastNameInput.value.trim(),
      studentAge: studentAgeInput.value.trim(),
      courseDirection: courseDirectionInput.value,
      phoneNumber: phoneNumberInput.value.trim()
    };

    // 2. Yuborish holatiga o'tkazish (Loading state)
    setLoading(true);
    hideAlert();

    try {
      // 3. Telegram xabar matnini tayyorlash
      const now = new Date();
      const formattedDate = now.toLocaleDateString("uz-UZ", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
      const formattedTime = now.toLocaleTimeString("uz-UZ", {
        hour: "2-digit",
        minute: "2-digit"
      });

      const message = `🎓 <b>YANGI O'QUVCHI RO'YXATDAN O'TDI!</b>\n\n` +
        `👤 <b>Ism:</b> ${escapeHtml(formData.firstName)}\n` +
        `👥 <b>Familiya:</b> ${escapeHtml(formData.lastName)}\n` +
        `🎂 <b>Yosh:</b> ${formData.studentAge} yosh\n` +
        `💻 <b>Yo'nalish:</b> ${escapeHtml(formData.courseDirection)}\n` +
        `📞 <b>Telefon raqam:</b> ${escapeHtml(formData.phoneNumber)}\n\n` +
        `⏰ <b>Vaqt:</b> ${formattedDate}, ${formattedTime}\n` +
        `🌐 <b>Manba:</b> IT Academy Landing Page`;

      // 4. Telegram Bot API ga so'rov yuborish
      const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_CONFIG.token}/sendMessage`;
      
      const response = await fetch(telegramUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CONFIG.chatId,
          text: message,
          parse_mode: "HTML"
        })
      });

      const result = await response.json();

      if (response.ok && result.ok) {
        // Muvaffaqiyatli yuborildi!
        form.reset();
        clearErrors();
        showSuccessModal(formData);
      } else {
        throw new Error(result.description || "Telegram API xatoligi yuz berdi");
      }
    } catch (error) {
      console.error("Yuborishda xatolik:", error);
      showAlert("error", "Kechirasiz, ma'lumotlarni yuborishda xatolik yuz berdi. Iltimos qaytadan urinib ko'ring yoki to'g'ridan-to'g'ri telefon orqali bog'laning.");
    } finally {
      setLoading(false);
    }
  });

  // Validatsiya funksiyasi
  function validateForm() {
    let valid = true;
    clearErrors();

    // Ism tekshiruvi
    const firstName = firstNameInput.value.trim();
    if (!firstName) {
      setError(firstNameInput, "firstNameError", "Iltimos, ismingizni kiriting");
      valid = false;
    } else if (firstName.length < 2) {
      setError(firstNameInput, "firstNameError", "Ism kamida 2 ta harfdan iborat bo'lishi kerak");
      valid = false;
    }

    // Familiya tekshiruvi
    const lastName = lastNameInput.value.trim();
    if (!lastName) {
      setError(lastNameInput, "lastNameError", "Iltimos, familiyangizni kiriting");
      valid = false;
    } else if (lastName.length < 2) {
      setError(lastNameInput, "lastNameError", "Familiya kamida 2 ta harfdan iborat bo'lishi kerak");
      valid = false;
    }

    // Yosh tekshiruvi
    const age = parseInt(studentAgeInput.value.trim(), 10);
    if (!age || isNaN(age)) {
      setError(studentAgeInput, "studentAgeError", "Yoshingizni kiriting");
      valid = false;
    } else if (age < 8 || age > 90) {
      setError(studentAgeInput, "studentAgeError", "To'g'ri yosh kiriting (8 - 90 yosh)");
      valid = false;
    }

    // Yo'nalish tekshiruvi
    const course = courseDirectionInput.value;
    if (!course) {
      setError(courseDirectionInput, "courseDirectionError", "Iltimos, o'qimoqchi bo'lgan yo'nalishni tanlang");
      valid = false;
    }

    // Telefon tekshiruvi (+998 (XX) XXX-XX-XX format: kamida 19 ta belgi yoki 9 ta raqam)
    const phone = phoneNumberInput.value.replace(/\D/g, "");
    if (!phone || phone.length < 12) {
      setError(phoneNumberInput, "phoneNumberError", "Telefon raqamni to'liq kiriting: +998 (__) ___-__-__");
      valid = false;
    }

    return valid;
  }

  function setError(inputEl, errorId, message) {
    const errorEl = document.getElementById(errorId);
    if (errorEl) errorEl.innerText = message;
    if (inputEl) inputEl.closest(".form-group")?.classList.add("input-error");
  }

  function clearErrors() {
    const errorMsgs = document.querySelectorAll(".input-error-msg");
    errorMsgs.forEach(el => el.innerText = "");
    const errorGroups = document.querySelectorAll(".input-error");
    errorGroups.forEach(el => el.classList.remove("input-error"));
  }

  function setLoading(isLoading) {
    if (isLoading) {
      submitBtn.disabled = true;
      btnText.innerText = "Yuborilmoqda...";
      btnIcon.style.display = "none";
      btnSpinner.style.display = "inline-block";
    } else {
      submitBtn.disabled = false;
      btnText.innerText = "Arizani Yuborish";
      btnIcon.style.display = "inline-block";
      btnSpinner.style.display = "none";
    }
  }

  function showAlert(type, message) {
    formAlert.className = `form-alert ${type}`;
    formAlert.innerHTML = `<span>${message}</span>`;
    formAlert.style.display = "block";
  }

  function hideAlert() {
    formAlert.style.display = "none";
  }

  // HTML maxsus belgilarini tozalash (XSS xavfsizligi)
  function escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

// ================= 7. MODAL BILDIRISHNOMA =================
function initModal() {
  const modal = document.getElementById("successModal");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const modalStudentName = document.getElementById("modalStudentName");
  const modalSummary = document.getElementById("modalSummary");

  if (!modal || !modalCloseBtn) return;

  modalCloseBtn.addEventListener("click", () => {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  });

  // Modal tashqarisiga bosilganda yopish
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("open");
      document.body.style.overflow = "";
    }
  });

  window.showSuccessModal = function (data) {
    modalStudentName.innerHTML = `Hurmatli <strong>${data.firstName} ${data.lastName}</strong>! Arizangiz Telegram kanalimizga muvaffaqiyatli yetib bordi. Tez orada mutaxassisimiz siz bilan bog'lanadi.`;

    modalSummary.innerHTML = `
      <div class="info-row"><span class="info-label">Yo'nalish:</span><span class="info-val">${data.courseDirection}</span></div>
      <div class="info-row"><span class="info-label">Yosh:</span><span class="info-val">${data.studentAge} yosh</span></div>
      <div class="info-row"><span class="info-label">Telefon:</span><span class="info-val">${data.phoneNumber}</span></div>
    `;

    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  };
}
