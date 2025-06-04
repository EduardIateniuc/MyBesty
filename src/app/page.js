"use client";

import { Heart, Play, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useRef, useState, useEffect } from "react";

export default function Home() {
  const [isStarted, setIsStarted] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [showAlbum, setShowAlbum] = useState(false);
  const [showNextPage, setShowNextPage] = useState(false);
  const [hasSpoken, setHasSpoken] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [photos, setPhotos] = useState([]);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

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
              caption: "Романтика",
              date: "2025-05-29",
            },
            {
              id: 4,
              url: "https://i.imgur.com/zQvMJX6.jpeg",
              caption: "...",
              date: "2024-04-05",
            },
            {
              id: 5,
              url: "https://i.imgur.com/2edAMSf.jpeg",
              caption: "Внимательно слушает",
              date: "2025-05-29",
            },
            {
              id: 6,
              url: "https://i.imgur.com/M4WtpQs.jpeg",
              caption: "#семья#любовь#счастье#праздник",
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
            url: "/api/placeholder/800/600",
            caption: "Наша первая встреча",
            date: "2024-01-15",
          },
          {
            id: 2,
            url: "/api/placeholder/800/600",
            caption: "Прогулка в парке",
            date: "2024-02-20",
          },
          {
            id: 3,
            url: "/api/placeholder/800/600",
            caption: "Романтический ужин",
            date: "2024-03-10",
          },
        ]);
      }
    };

    loadPhotos();
  }, []);

  useEffect(() => {
    if (isStarted && !showAlbum && !showNextPage) {
      const audioTimeout = setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.loop = true; // Зацикливание аудио
          audioRef.current.play().catch(console.error);
        }
      }, 100);

      return () => clearTimeout(audioTimeout);
    }
  }, [isStarted, showAlbum, showNextPage]);

  const handleStart = () => {
    setFadeOut(true);
    setTimeout(() => {
      setIsStarted(true);
    }, 1000);
  };

  const handleVideoEnd = () => {
    setShowAlbum(true);
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  // Минимальная дистанция свайпа (в пикселях)
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
    setShowNextPage(true);
    setShowAlbum(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 relative overflow-hidden">
      <audio ref={audioRef} src="/audio/audio.m4a" preload="auto" />

      {/* Animated background elements */}
      <div className="absolute inset-0">
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
          <div className="text-center space-y-8 backdrop-blur-sm bg-white/30 rounded-3xl p-12 shadow-2xl border border-white/40">
            {/* Date */}
            <div className="space-y-2">
              <h1 className="text-7xl md:text-8xl font-light text-transparent bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 bg-clip-text animate-pulse">
                6
              </h1>
              <p className="text-2xl md:text-3xl font-light text-gray-700 tracking-wider">
                JUNE 2025
              </p>
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-pink-400 to-transparent mx-auto"></div>
            </div>

            {/* Subtitle */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-light text-gray-600 leading-relaxed">
                Special day for special Person
              </h2>
    
            </div>

            {/* Start button */}
            <button
              onClick={handleStart}
              className="group relative px-12 py-4 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-medium text-lg"
            >
              <div className="flex items-center space-x-3">
                <Play className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                <span>Начать</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </button>
          </div>

          {/* Bottom decoration */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-pink-300 rounded-full animate-pulse"></div>
              <div
                className="w-2 h-2 bg-rose-300 rounded-full animate-pulse"
                style={{ animationDelay: "0.5s" }}
              ></div>
              <div
                className="w-2 h-2 bg-purple-300 rounded-full animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>
          </div>
        </div>
      ) : showAlbum ? (
        /* Photo Album - Instagram Style */
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
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 sm:hidden">
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
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 via-rose-100 to-amber-100 px-4 py-10 animate-fade-in">
  <div className="text-center space-y-6 backdrop-blur-md bg-white/60 border border-white/50 shadow-2xl rounded-3xl p-10 max-w-2xl w-full animate-slide-up">
    
    {/* Заголовок */}
    <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-pink-500 via-red-400 to-rose-600 bg-clip-text animate-pulse">
      С Днём рождения, Кира! 🎉
    </h1>

    {/* Подзаголовок */}
    <p className="text-lg md:text-xl text-gray-800 font-medium leading-relaxed">
      Ты — удивительная, добрая, светлая девочка, которая делает этот мир красивее просто своим присутствием. 🌟
    </p>

    <p className="text-lg font-semibold text-rose-600">
      С любовью и восхищением 💖
    </p>
  </div>

  {/* Гифка снизу */}
  <div className="mt-8 w-full h-1/2 max-w-sm">
    <img
      src="videos/gif.gif"
      alt="Поздравительная гифка"
      className="w-full h-auto rounded-2xl shadow-lg"
    />
  </div>
</div>

      ) : (
        /* Video Screen */
        <div className="fixed inset-0 bg-black animate-fade-in">
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            onEnded={handleVideoEnd}
            poster="/api/placeholder/1920/1080"
          >
            <source src="/videos/walking.mp4" type="video/mp4" />
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-white">
              <div className="text-center space-y-4">
                <Play className="w-16 h-16 mx-auto text-pink-400" />
                <p className="text-xl">Добавьте ваше видео</p>
                <p className="text-sm text-gray-400">
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

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
}
