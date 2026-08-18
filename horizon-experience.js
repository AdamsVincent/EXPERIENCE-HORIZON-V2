(() => {
  "use strict";

  function initHorizonExperience() {
    const voice = document.getElementById("voiceIntroAudio");
    const voiceButton = document.getElementById("voiceIntroButton");
    const voiceStatus = document.getElementById("voiceIntroStatus");
    const music = document.getElementById("horizonAudio");

    let musicWasPlayingBeforeVoice = false;

    // VOIX D'INTRODUCTION
    if (voice && voiceButton) {
      voiceButton.addEventListener("click", async () => {
        try {
          if (voice.paused) {
            musicWasPlayingBeforeVoice = !!music && !music.paused;

            if (musicWasPlayingBeforeVoice && music) {
              music.pause();
            }

            await voice.play();

            voiceButton.textContent = "❚❚ Mettre en pause";
            voiceButton.setAttribute("aria-pressed", "true");

            if (voiceStatus) {
              voiceStatus.textContent = "Message de Vincent en cours";
            }
          } else {
            voice.pause();

            voiceButton.textContent = "▶ Reprendre le message";
            voiceButton.setAttribute("aria-pressed", "false");

            if (voiceStatus) {
              voiceStatus.textContent = "Introduction personnelle";
            }
          }
        } catch (error) {
          console.warn("Lecture de la voix impossible :", error);

          if (voiceStatus) {
            voiceStatus.textContent = "Impossible de lancer l’audio";
          }
        }
      });

      voice.addEventListener("ended", async () => {
        voiceButton.textContent = "▶ Réécouter le message de Vincent";
        voiceButton.setAttribute("aria-pressed", "false");

        if (voiceStatus) {
          voiceStatus.textContent = "Introduction personnelle";
        }

        if (musicWasPlayingBeforeVoice && music) {
          try {
            await music.play();
          } catch (error) {
            console.warn("Reprise de la musique impossible :", error);
          }
        }
      });
    }

    // ANIMATIONS AU SCROLL
    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-revealed");
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -6% 0px"
        }
      );

      revealElements.forEach((element) => {
        revealObserver.observe(element);
      });
    } else {
      revealElements.forEach((element) => {
        element.classList.add("is-revealed");
      });
    }

    // ANIMATION 15 € / JOUR
    const dailyValue = document.getElementById("dailyValue");

    if (dailyValue) {
      let hasAnimated = false;

      const animateDailyValue = () => {
        if (hasAnimated) return;

        hasAnimated = true;

        const target = 15;
        const duration = 900;
        const startTime = performance.now();

        const update = (now) => {
          const progress = Math.min(
            (now - startTime) / duration,
            1
          );

          const eased =
            1 - Math.pow(1 - progress, 3);

          dailyValue.textContent = String(
            Math.round(target * eased)
          );

          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            dailyValue.textContent = "15";
          }
        };

        requestAnimationFrame(update);
      };

      if ("IntersectionObserver" in window) {
        const priceObserver = new IntersectionObserver(
          (entries, observer) => {
            if (
              entries.some(
                (entry) => entry.isIntersecting
              )
            ) {
              animateDailyValue();
              observer.disconnect();
            }
          },
          {
            threshold: 0.45
          }
        );

        priceObserver.observe(dailyValue);
      } else {
        animateDailyValue();
      }
    }

    // ENTRÉE PREMIUM APRÈS CHOIX MUSIQUE / SANS MUSIQUE
    const gateway = document.getElementById("horizonGateway");
    const gatewayEnter = document.getElementById("horizonGatewayEnter");
    const musicChoice = document.getElementById("welcomeSoundOn");
    const silentChoice = document.getElementById("welcomeSoundOff");

    let gatewayTimer = null;

    const hideGateway = () => {
      if (!gateway) return;

      gateway.classList.remove("is-visible");
      gateway.setAttribute("aria-hidden", "true");

      if (gatewayTimer) {
        clearTimeout(gatewayTimer);
      }
    };

    const showGateway = () => {
      if (!gateway) return;

      if (gatewayTimer) {
        clearTimeout(gatewayTimer);
      }

      setTimeout(() => {
        gateway.classList.add("is-visible");
        gateway.setAttribute("aria-hidden", "false");

        gatewayTimer = setTimeout(() => {
          hideGateway();
        }, 3600);
      }, 120);
    };

    if (musicChoice) {
      musicChoice.addEventListener("click", showGateway);
    }

    if (silentChoice) {
      silentChoice.addEventListener("click", showGateway);
    }

    if (gatewayEnter) {
      gatewayEnter.addEventListener("click", hideGateway);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initHorizonExperience
    );
  } else {
    initHorizonExperience();
  }
})();
