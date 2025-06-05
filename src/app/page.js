"use client";

import { Heart, Play, ChevronLeft, ChevronRight, X, Volume2 } from "lucide-react";
import { useRef, useState, useEffect } from "react";

export default function Home() {
  const [showSoundAlert, setShowSoundAlert] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [showAlbum, setShowAlbum] = useState(false);
  const [showNextPage, setShowNextPage] = useState(false);
  const [hasSpoken, setHasSpoken] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [photos, setPhotos] = useState([]);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [videoEnded, setVideoEnded] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const response = await fetch("/photos.json");
        if (response.ok) {
          const data = await response.json();
          setPhotos(data.photos || []);
        } else {
          // Fallback - пример фотографий
          setPhotos([
            {
              id: 1,
              url: "https://i.imgur.com/6WpaWtd.jpeg",
              caption: "У бизи дома тусовка",
              date: "2025-05-31",
            },
            {
              id: 2,
              url: "https://i.imgur.com/wnou0bM.jpeg",
              caption: "Сидит с любимым",
              date: "2025-05-31",
            },
            {
              id: 3,
              url: "https://i.imgur.com/cUyHFmX.jpeg",
              caption: "Читает переписки с мальчиками",
              date: "2025-05-29",
            },
            {
              id: 4,
              url: "https://i.imgur.com/zQvMJX6.jpeg",
              caption: "КУДА РУЧКИ...",
              date: "2024-04-05",
            },
            {
              id: 5,
              url: "https://i.imgur.com/2edAMSf.jpeg",
              caption: "Он просто хочет слушать ее вечно...",
              date: "2025-05-29",
            },
            {
              id: 6,
              url: "https://i.imgur.com/M4WtpQs.jpeg",
              caption: "#семья#любовь#бытовуха#дети#",
              date: "2025-05-31",
            },
            {
              id: 7,
              url: "videos/kira.gif",
              caption: "кривляшка...",
              date: "2025-05-31",
            },
            {
              id: 8,
              url: "https://i.imgur.com/YRgNPT5.jpeg",
              caption: "типо не нравится ей",
              date: "2025-05-31",
            },
            {
              id: 9,
              url: "https://i.imgur.com/Nh2NIpk.jpeg",
              caption: "Обязательно руки нюхать????!?!??!",
              date: "2025-05-31",
            },
          ]);
        }
      } catch (error) {
        console.error("Ошибка загрузки фотографий:", error);
        // Fallback фотографии
        setPhotos([
          {
            id: 1,
            url: "/api/placeholder/400/400",
            caption: "Наша первая встреча",
            date: "2024-01-15",
          },
          {
            id: 2,
            url: "/api/placeholder/400/400",
            caption: "Прогулка в парке",
            date: "2024-02-20",
          },
          {
            id: 3,
            url: "/api/placeholder/400/400",
            caption: "Романтический ужин",
            date: "2024-03-10",
          },
        ]);
      }
    };

    loadPhotos();

    // Автоматически скрыть предупреждение о звуке через 6 секунд
    const soundAlertTimer = setTimeout(() => {
      setShowSoundAlert(false);
    }, 6000);

    return () => clearTimeout(soundAlertTimer);
  }, []);

  useEffect(() => {
    if (isStarted && !showAlbum && !showNextPage) {
      const audioTimeout = setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.loop = true;
          audioRef.current.play().catch(console.error);
        }
      }, 100);

      return () => clearTimeout(audioTimeout);
    }
  }, [isStarted, showAlbum, showNextPage]);

  const handleSoundAlertClose = () => {
    setShowSoundAlert(false);
  };

  const handleStart = () => {
    setFadeOut(true);
    setTimeout(() => {
      setIsStarted(true);
    }, 1000);
  };

  const handleVideoEnd = () => {
    setVideoEnded(true);
    setTimeout(() => {
      setShowAlbum(true);
    }, 800);
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && photos.length > 0) {
      handleNextPhoto();
    }
    if (isRightSwipe && photos.length > 0) {
      handlePrevPhoto();
    }
  };

  const handleCloseAlbum = () => {
    setShowAlbum(false);
    setTimeout(() => {
      setShowNextPage(true);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 relative overflow-hidden">
      <audio ref={audioRef} src="/audio/audio.m4a" preload="auto" />

      {/* Sound Alert - iPhone Style */}
      {showSoundAlert && (
        <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white bg-opacity-95 backdrop-blur-xl rounded-3xl p-8 mx-4 max-w-sm w-full shadow-2xl animate-scale-in">
            <div className="text-center space-y-6">
              {/* Sound Icon */}
              <div className="flex justify-center">
                <div className="bg-gradient-to-br from-pink-400 to-pink-500 rounded-full p-4 animate-pulse">
                  <Volume2 className="w-8 h-8 text-white" />
                </div>
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-900">
                Включите звук
              </h3>
              
              {/* Message */}
              <p className="text-gray-600 text-base leading-relaxed">
                Для лучшего восприятия рекомендуем включить звук
              </p>
              
              {/* Button */}
              <button
                onClick={handleSoundAlertClose}
                className="w-full bg-pink-500 hover:bg-pink-500 text-white font-medium py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                Понятно
              </button>
            </div>
            
            {/* Auto-close progress bar */}
            <div className="mt-4 bg-gray-200 rounded-full h-1 overflow-hidden">
              <div className="bg-pink-500 h-full rounded-full animate-progress"></div>
            </div>
          </div>
        </div>
      )}

      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-2 h-2 bg-pink-300 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-rose-400 rounded-full animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-purple-300 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
      </div>

      {!isStarted ? (
        /* Initial Screen */
        <div
          className={`min-h-screen flex flex-col items-center justify-center px-6 transition-all duration-1000 ${
            fadeOut ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
        >
          {/* Floating hearts */}
          <div className="absolute inset-0 pointer-events-none">
            <Heart
              className="absolute top-1/4 left-1/4 w-6 h-6 text-pink-300 animate-bounce"
              style={{ animationDelay: "0s" }}
            />
            <Heart
              className="absolute top-1/3 right-1/4 w-4 h-4 text-rose-300 animate-bounce"
              style={{ animationDelay: "1s" }}
            />
            <Heart
              className="absolute bottom-1/3 left-1/3 w-5 h-5 text-purple-300 animate-bounce"
              style={{ animationDelay: "2s" }}
            />
          </div>

          {/* Main content */}
          <div className="text-center space-y-8 backdrop-blur-sm bg-white/30 rounded-3xl p-8 md:p-12 shadow-2xl border border-white/40 max-w-md w-full animate-slide-up-delayed">
            {/* Date */}
            <div className="space-y-2">
              <h1 className="text-6xl md:text-7xl font-light text-transparent bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 bg-clip-text animate-pulse">
                6
              </h1>
              <p className="text-xl md:text-2xl font-light text-gray-700 tracking-wider">
                JUNE 2025
              </p>
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-pink-400 to-transparent mx-auto"></div>
            </div>

            {/* Subtitle */}
            <div className="space-y-4">
              <h2 className="text-lg md:text-xl font-light text-gray-600 leading-relaxed">
                Special day for special Person
              </h2>
            </div>

            {/* Start button */}
            <button
              onClick={handleStart}
              className="group relative px-10 py-4 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 font-medium text-base w-full"
            >
              <div className="flex items-center justify-center space-x-3">
                <Play className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                <span>Начать</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </button>
          </div>
        </div>
      ) : showAlbum ? (
        /* Photo Album - Smooth Appearance */
        <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50 animate-fade-in">
          <div className="relative max-w-lg w-full mx-4">
            {/* Close button */}
            <button
              onClick={handleCloseAlbum}
              className="absolute -top-12 right-0 text-white hover:text-pink-300 transition-colors duration-200 z-10"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Instagram-style post container */}
            <div className="bg-white rounded-lg overflow-hidden shadow-2xl border border-gray-50">
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Наши воспоминания
                    </p>
                    <p className="text-sm text-gray-500">6 июня 2024</p>
                  </div>
                </div>
              </div>

              {/* Photo container */}
              <div
                className="relative aspect-square h-full bg-gray-100 overflow-hidden"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                {photos.length > 0 && (
                  <>
                    <div
                      className="flex transition-transform duration-300 ease-out h-full"
                      style={{
                        transform: `translateX(-${currentPhotoIndex * 100}%)`,
                        width: `${photos.length * 100}%`,
                      }}
                    >
                      {photos.map((photo, index) => (
                        <div
                          key={photo.id}
                          className="w-full h-100 flex-shrink-0 relative"
                        >
                          <img
                            src={photo.url}
                            alt="memory"
                            className="w-100 h-full object-cover rounded-lg"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Navigation arrows - скрыты на мобильных устройствах */}
                    {photos.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevPhoto}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all duration-200 hidden sm:block"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={handleNextPhoto}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all duration-200 hidden sm:block"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}

                    {/* Photo indicators */}
                    {photos.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {photos.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentPhotoIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${
                              index === currentPhotoIndex
                                ? "bg-white"
                                : "bg-white bg-opacity-50"
                            }`}
                          />
                        ))}
                      </div>
                    )}

                    {/* Swipe hint для мобильных */}
                    <div className="absolute top-4 left-1/2 opacity-30 transform -translate-x-1/2 sm:hidden">
                      <div className="bg-black bg-opacity-50 text-white text-xs px-3 py-1 rounded-full">
                        Листай пальчиком ← →
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Caption and interactions */}
              <div className="p-4 space-y-3">
                {/* Like buttons area */}
                <div className="flex items-center space-x-4">
                  <Heart className="w-6 h-6 text-rose-500 fill-current" />
                  <span className="text-sm text-gray-600">
                    {currentPhotoIndex + 1} из {photos.length}
                  </span>
                </div>

                {/* Caption */}
                {photos[currentPhotoIndex] && (
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-semibold">Воспоминание:</span>{" "}
                      {photos[currentPhotoIndex].caption}
                    </p>
                    {photos[currentPhotoIndex].date && (
                      <p className="text-xs text-gray-500">
                        {new Date(
                          photos[currentPhotoIndex].date
                        ).toLocaleDateString("ru-RU", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom navigation */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleCloseAlbum}
                className="px-8 py-3 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-full hover:from-rose-500 hover:to-pink-600 transition-all duration-300 shadow-lg font-medium"
              >
                Продолжить
              </button>
            </div>
          </div>
        </div>
      ) : showNextPage ? (
        /* Next Page */
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 via-rose-100 to-amber-100 px-4 py-10 animate-fade-in-slow">
          <div className="text-center space-y-6 backdrop-blur-md bg-white/70 border border-white/60 shadow-2xl rounded-3xl p-8 max-w-lg w-full animate-slide-up-smooth">
            
            {/* Заголовок */}
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-pink-500 via-red-400 to-rose-600 bg-clip-text animate-pulse">
              С Днём рождения, Кира! 🎉
            </h1>

            {/* Подзаголовок */}
            <p className="text-base md:text-lg text-gray-800 font-medium leading-relaxed">
              Ты — удивительная, добрая, светлая девочка, которая делает этот мир красивее просто своим присутствием. 🌟
            </p>

            <p className="text-lg font-semibold text-rose-600">
              С любовью и восхищением 💖
            </p>
          </div>

          {/* Гифка снизу */}
          <div className="mt-8 w-full max-w-xs animate-slide-up-delayed">
            <img
              src="videos/gif.gif"
              alt="Поздравительная гифка"
              className="w-full h-auto rounded-2xl shadow-lg"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        </div>
      ) : (
        /* Video Screen */
        <div className={`fixed inset-0 bg-black transition-all duration-1000 ${videoEnded ? 'opacity-0' : 'opacity-100'}`}>
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnd}
            poster="/api/placeholder/1920/1080"
          >
            <source src="/videos/walking.mp4" type="video/mp4" />
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-white">
              <div className="text-center space-y-4 animate-fade-in">
                <Play className="w-16 h-16 mx-auto text-pink-400 animate-bounce" />
                <p className="text-xl">Добавьте ваше видео</p>
                <p className="text-sm text-gray-400 px-4">
                  Замените src="/videos/walking.mp4" на путь к вашему видео
                </p>
              </div>
            </div>
          </video>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fade-in-slow {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up-smooth {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-slow {
          animation: fade-in-slow 1.2s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }

        .animate-slide-up-smooth {
          animation: slide-up-smooth 1s ease-out;
        }

        .animate-slide-up-delayed {
          animation: slide-up 0.8s ease-out 0.3s both;
        }

        .animate-progress {
          animation: progress 6s linear;
        }
      `}</style>
    </div>
  );
}