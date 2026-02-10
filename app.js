// تطبيق مفكرة رمضان
// Local-First PWA بدون اتصال خلفي

document.addEventListener('DOMContentLoaded', function() {
    // إدارة الحالة
    const state = {
        tasbihCount: 0,
        currentDhikr: 'سبحان الله',
        dailyProgress: 75,
        dayNumber: 15,
        totalDays: 30,
        prayers: {
            fajr: false,
            dhuhr: false,
            asr: false,
            maghrib: false,
            isha: false,
            taraweeh: false,
            quran: false,
            tahajjud: false
        },
        quranProgress: {
            juz: 12,
            pages: 180,
            targetKhatma: 1
        },
        impactStars: 24,
        dedication: {
            to: 'أمي',
            message: 'إلى روح أمي، التي علمتني معنى الصبر والإيمان.'
        },
        challenges: [
            'تصدق على شخص محتاج اليوم، ولو بمبلغ بسيط.',
            'صلِّ ركعتين قيام ليل قبل النوم.',
            'اقرأ صفحة من القرآن بتدبر وتفكر.',
            'اتصل بقريب لك وسأل عن أحواله.',
            'سامح شخصًا أخطأ في حقك.',
            'قل لا إله إلا الله 100 مرة اليوم.',
            'أطعم محتاجًا وجبة إفطار.',
            'حافظ على أذكار الصباح والمساء.',
            'تصدق بملابسك القديمة.',
            'صلِّ على النبي ﷺ 100 مرة.'
        ],
        currentChallengeIndex: 0,
        // بيانات وهمية لأوقات الصلاة
        prayerTimes: [
            { name: 'الفجر', time: '04:45', completed: true },
            { name: 'الظهر', time: '12:30', completed: false },
            { name: 'العصر', time: '15:45', completed: false },
            { name: 'المغرب', time: '19:23', completed: false },
            { name: 'العشاء', time: '20:45', completed: false },
            { name: 'التراويح', time: '21:30', completed: false }
        ]
    };
    
    // العناصر DOM
    const elements = {
        privacyMessage: document.getElementById('privacyMessage'),
        privacyClose: document.getElementById('privacyClose'),
        tasbihBtn: document.getElementById('tasbihBtn'),
        tasbihModal: document.getElementById('tasbihModal'),
        tasbihClose: document.getElementById('tasbihClose'),
        tasbihCount: document.getElementById('tasbihCount'),
        modalTasbihCount: document.getElementById('modalTasbihCount'),
        tasbihType: document.getElementById('tasbihType'),
        tasbihAdd: document.getElementById('tasbihAdd'),
        tasbihReset: document.getElementById('tasbihReset'),
        tasbihChange: document.getElementById('tasbihChange'),
        progressRing: document.getElementById('progressRing'),
        progressPercent: document.getElementById('progressPercent'),
        dayProgressText: document.getElementById('dayProgressText'),
        timeRemaining: document.getElementById('timeRemaining'),
        dayNumber: document.getElementById('dayNumber'),
        nextPrayerName: document.getElementById('nextPrayerName'),
        prayerCountdown: document.getElementById('prayerCountdown'),
        nextPrayerTime: document.getElementById('nextPrayerTime'),
        fajrToggle: document.getElementById('fajrToggle'),
        dhuhrToggle: document.getElementById('dhuhrToggle'),
        asrToggle: document.getElementById('asrToggle'),
        maghribToggle: document.getElementById('maghribToggle'),
        ishaToggle: document.getElementById('ishaToggle'),
        taraweehToggle: document.getElementById('taraweehToggle'),
        quranToggle: document.getElementById('quranToggle'),
        tahajjudToggle: document.getElementById('tahajjudToggle'),
        juzCompleted: document.getElementById('juzCompleted'),
        pagesCompleted: document.getElementById('pagesCompleted'),
        khatmaProgress: document.getElementById('khatmaProgress'),
        quranProgressBar: document.getElementById('quranProgressBar'),
        quranTarget: document.getElementById('quranTarget'),
        dailyChallenge: document.getElementById('dailyChallenge'),
        impactGrid: document.getElementById('impactGrid'),
        impactCount: document.getElementById('impactCount'),
        dedicationText: document.getElementById('dedicationText'),
        editDedicationBtn: document.getElementById('editDedicationBtn'),
        quranDetailsBtn: document.getElementById('quranDetailsBtn'),
        quranModal: document.getElementById('quranModal'),
        quranClose: document.getElementById('quranClose'),
        khatmaTarget: document.getElementById('khatmaTarget'),
        updateKhatmaTarget: document.getElementById('updateKhatmaTarget'),
        addJuz: document.getElementById('addJuz'),
        addPages: document.getElementById('addPages'),
        addQuranProgress: document.getElementById('addQuranProgress'),
        totalJuz: document.getElementById('totalJuz'),
        totalPages: document.getElementById('totalPages'),
        totalKhatmat: document.getElementById('totalKhatmat'),
        dedicationModal: document.getElementById('dedicationModal'),
        dedicationClose: document.getElementById('dedicationClose'),
        dedicationTo: document.getElementById('dedicationTo'),
        dedicationMessage: document.getElementById('dedicationMessage'),
        saveDedication: document.getElementById('saveDedication'),
        prayerTableBtn: document.getElementById('prayerTableBtn'),
        prayerModal: document.getElementById('prayerModal'),
        prayerClose: document.getElementById('prayerClose'),
        settingsBtn: document.getElementById('settingsBtn'),
        settingsModal: document.getElementById('settingsModal'),
        settingsClose: document.getElementById('settingsClose'),
        serenityMode: document.getElementById('serenityMode'),
        notificationsToggle: document.getElementById('notificationsToggle'),
        exportDataBtn: document.getElementById('exportDataBtn'),
        clearDataBtn: document.getElementById('clearDataBtn'),
        exportBtn: document.getElementById('exportBtn'),
        eidCelebration: document.getElementById('eidCelebration'),
        shareEid: document.getElementById('shareEid')
    };
    
    // تهيئة التطبيق
    function initializeApp() {
        // إعداد التواريخ
        setupDates();
        
        // تحميل البيانات من التخزين المحلي
        loadFromStorage();
        
        // إعداد واجهة المستخدم
        setupUI();
        
        // إعداد المستمعين للأحداث
        setupEventListeners();
        
        // بدء المؤقتات
        startTimers();
        
        // التحقق من وضع السكينة
        checkSerenityMode();
        
        // التحقق من عيد الفطر
        checkForEid();
    }
    
    // إعداد التواريخ
    function setupDates() {
        const now = new Date();
        
        // التاريخ الميلادي
        const gregorianOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const gregorianDate = now.toLocaleDateString('ar-SA', gregorianOptions);
        document.getElementById('gregorianDate').textContent = gregorianDate;
        
        // التاريخ الهجري (تقريبي)
        const hijriMonth = 'رمضان';
        const hijriYear = '1445';
        document.getElementById('hijriDate').textContent = `${hijriMonth} ${hijriYear}`;
    }
    
    // تحميل البيانات من التخزين المحلي
    function loadFromStorage() {
        // محاولة تحميل البيانات المحفوظة
        try {
            const savedData = localStorage.getItem('ramadanTracker');
            if (savedData) {
                const data = JSON.parse(savedData);
                
                // تحديث الحالة بالبيانات المحفوظة
                Object.assign(state, data);
                
                // تحديث الواجهة
                updateUIFromState();
            }
        } catch (error) {
            console.error('Error loading data from storage:', error);
        }
    }
    
    // حفظ البيانات إلى التخزين المحلي
    function saveToStorage() {
        try {
            localStorage.setItem('ramadanTracker', JSON.stringify(state));
        } catch (error) {
            console.error('Error saving data to storage:', error);
        }
    }
    
    // إعداد واجهة المستخدم
    function setupUI() {
        // إنشاء خريطة الأثر (النجوم)
        createImpactStars();
        
        // تحديث تحديات اليوم
        updateDailyChallenge();
        
        // تحديث تقدم اليوم
        updateDayProgress();
        
        // تحديث تقدم القرآن
        updateQuranProgress();
        
        // تحديث ويدجت الصلاة
        updateNextPrayer();
        
        // تحديث الإهداء
        updateDedication();
    }
    
    // إنشاء نجوم خريطة الأثر
    function createImpactStars() {
        elements.impactGrid.innerHTML = '';
        const totalStars = 30; // عدد أيام رمضان
        
        for (let i = 0; i < totalStars; i++) {
            const star = document.createElement('div');
            star.className = 'impact-star';
            if (i < state.impactStars) {
                star.classList.add('active');
            }
            star.dataset.index = i;
            elements.impactGrid.appendChild(star);
        }
        
        elements.impactCount.textContent = `${state.impactStars}/${totalStars}`;
    }
    
    // تحديث تحديات اليوم
    function updateDailyChallenge() {
        // تحديث التحدي بناءً على اليوم
        const today = new Date().getDate();
        state.currentChallengeIndex = today % state.challenges.length;
        elements.dailyChallenge.textContent = state.challenges[state.currentChallengeIndex];
    }
    
    // تحديث تقدم اليوم
    function updateDayProgress() {
        // حساب النسبة المئوية
        const progress = state.dailyProgress;
        const circumference = 2 * Math.PI * 54; // نصف قطر الدائرة
        const offset = circumference - (progress / 100) * circumference;
        
        // تحديث الدائرة
        elements.progressRing.style.strokeDashoffset = offset;
        elements.progressPercent.textContent = `${progress}%`;
        elements.dayProgressText.textContent = `${progress}%`;
        
        // تحديث رقم اليوم
        elements.dayNumber.textContent = state.dayNumber;
        
        // حساب الوقت المتبقي (وهمي)
        const remainingHours = Math.floor((100 - progress) / 25 * 24);
        elements.timeRemaining.textContent = `${remainingHours} ساعات`;
    }
    
    // تحديث تقدم القرآن
    function updateQuranProgress() {
        const progress = state.quranProgress;
        const pagesPerJuz = 20; // تقريبًا
        const totalPages = 604; // صفحات القرآن الكريم
        
        // تحديث الأرقام
        elements.juzCompleted.textContent = progress.juz;
        elements.pagesCompleted.textContent = progress.pages;
        elements.totalJuz.textContent = progress.juz;
        elements.totalPages.textContent = progress.pages;
        
        // حساب نسبة الختمة
        const pagesPerKhatma = totalPages;
        const currentKhatma = progress.pages / pagesPerKhatma;
        const khatmaDisplay = currentKhatma.toFixed(1);
        
        elements.khatmaProgress.textContent = khatmaDisplay;
        elements.totalKhatmat.textContent = khatmaDisplay;
        
        // تحديث شريط التقدم
        const progressPercent = (currentKhatma / progress.targetKhatma) * 100;
        const cappedProgress = Math.min(progressPercent, 100);
        elements.quranProgressBar.style.width = `${cappedProgress}%`;
        
        // تحديث الهدف
        elements.quranTarget.textContent = progress.targetKhatma;
        elements.khatmaTarget.value = progress.targetKhatma;
    }
    
    // تحديث ويدجت الصلاة
    function updateNextPrayer() {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes(); // الوقت الحالي بالدقائق
        
        // البحث عن الصلاة القادمة
        let nextPrayer = null;
        for (const prayer of state.prayerTimes) {
            const [hours, minutes] = prayer.time.split(':').map(Number);
            const prayerTime = hours * 60 + minutes;
            
            // إذا كانت الصلاة لم تؤد بعد
            if (prayerTime > currentTime && !prayer.completed) {
                nextPrayer = prayer;
                break;
            }
        }
        
        // إذا لم توجد صلاة قادمة (نهاية اليوم)
        if (!nextPrayer) {
            nextPrayer = state.prayerTimes[0]; // الفجر في اليوم التالي
            nextPrayer.name = 'الفجر (غدًا)';
        }
        
        // تحديث الواجهة
        elements.nextPrayerName.textContent = nextPrayer.name;
        elements.nextPrayerTime.textContent = nextPrayer.time;
        
        // بدء العداد التنازلي
        startPrayerCountdown(nextPrayer.time);
    }
    
    // بدء العداد التنازلي للصلاة
    function startPrayerCountdown(prayerTime) {
        const updateCountdown = () => {
            const now = new Date();
            const [hours, minutes] = prayerTime.split(':').map(Number);
            
            // إنشاء تاريخ الصلاة
            const prayerDate = new Date();
            prayerDate.setHours(hours, minutes, 0, 0);
            
            // إذا كان وقت الصلاة قد مضى، اضبطه لليوم التالي
            if (prayerDate < now) {
                prayerDate.setDate(prayerDate.getDate() + 1);
            }
            
            // حساب الفارق بالثواني
            const diff = Math.floor((prayerDate - now) / 1000);
            
            if (diff > 0) {
                const hours = Math.floor(diff / 3600);
                const minutes = Math.floor((diff % 3600) / 60);
                const seconds = diff % 60;
                
                // تحديث العرض
                const countdownElements = elements.prayerCountdown.querySelectorAll('.countdown-number');
                countdownElements[0].textContent = hours.toString().padStart(2, '0');
                countdownElements[1].textContent = minutes.toString().padStart(2, '0');
                countdownElements[2].textContent = seconds.toString().padStart(2, '0');
            } else {
                // إعادة تحميل الصلاة القادمة عندما ينتهي العداد
                updateNextPrayer();
            }
        };
        
        // تحديث على الفور ثم كل ثانية
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
    
    // تحديث الإهداء
    function updateDedication() {
        const dedication = state.dedication;
        const dedicationElement = elements.dedicationText.querySelector('span');
        dedicationElement.textContent = `${dedication.to}: ${dedication.message}`;
    }
    
    // إعداد المستمعين للأحداث
    function setupEventListeners() {
        // إغلاق رسالة الخصوصية
        elements.privacyClose.addEventListener('click', () => {
            elements.privacyMessage.style.display = 'none';
            localStorage.setItem('privacyAccepted', 'true');
        });
        
        // التحقق مما إذا تم قبول الخصوصية من قبل
        if (localStorage.getItem('privacyAccepted')) {
            elements.privacyMessage.style.display = 'none';
        }
        
        // المسبحة الإلكترونية
        elements.tasbihBtn.addEventListener('click', openTasbihModal);
        elements.tasbihClose.addEventListener('click', closeTasbihModal);
        elements.tasbihAdd.addEventListener('click', incrementTasbih);
        elements.tasbihReset.addEventListener('click', resetTasbih);
        elements.tasbihChange.addEventListener('click', changeDhikr);
        
        // أحداث التبديلات (Toggle)
        const toggles = [
            { element: elements.fajrToggle, key: 'fajr' },
            { element: elements.dhuhrToggle, key: 'dhuhr' },
            { element: elements.asrToggle, key: 'asr' },
            { element: elements.maghribToggle, key: 'maghrib' },
            { element: elements.ishaToggle, key: 'isha' },
            { element: elements.taraweehToggle, key: 'taraweeh' },
            { element: elements.quranToggle, key: 'quran' },
            { element: elements.tahajjudToggle, key: 'tahajjud' }
        ];
        
        toggles.forEach(toggle => {
            toggle.element.addEventListener('change', function() {
                state.prayers[toggle.key] = this.checked;
                updateProgressFromPrayers();
                saveToStorage();
                
                // تحديث نجمة في خريطة الأثر إذا تم إكمال 5 صلوات
                updateImpactStars();
            });
        });
        
        // أحداث القرآن
        elements.quranDetailsBtn.addEventListener('click', openQuranModal);
        elements.quranClose.addEventListener('click', closeQuranModal);
        elements.updateKhatmaTarget.addEventListener('click', updateKhatmaTarget);
        elements.addQuranProgress.addEventListener('click', addQuranProgress);
        
        // أحداث الإهداء
        elements.editDedicationBtn.addEventListener('click', openDedicationModal);
        elements.dedicationClose.addEventListener('click', closeDedicationModal);
        elements.saveDedication.addEventListener('click', saveDedication);
        
        // أحداث الصلوات
        elements.prayerTableBtn.addEventListener('click', openPrayerModal);
        elements.prayerClose.addEventListener('click', closePrayerModal);
        
        // أحداث الإعدادات
        elements.settingsBtn.addEventListener('click', openSettingsModal);
        elements.settingsClose.addEventListener('click', closeSettingsModal);
        elements.exportDataBtn.addEventListener('click', exportData);
        elements.clearDataBtn.addEventListener('click', clearData);
        elements.exportBtn.addEventListener('click', exportData);
        
        // أحداث تهنئة العيد
        elements.shareEid.addEventListener('click', shareEid);
        
        // أحداث المسبحة المسبقة
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const dhikr = this.dataset.dhikr;
                state.currentDhikr = dhikr;
                elements.tasbihType.textContent = dhikr;
            });
        });
        
        // إغلاق النوافذ المنبثقة بالنقر خارجها
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.style.display = 'none';
                }
            });
        });
    }
    
    // بدء المؤقتات
    function startTimers() {
        // تحديث الوقت المتبقي كل دقيقة
        setInterval(() => {
            updateDayProgress();
        }, 60000);
        
        // التحقق من وضع السكينة كل 5 دقائق
        setInterval(() => {
            checkSerenityMode();
        }, 300000);
    }
    
    // التحقق من وضع السكينة
    function checkSerenityMode() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        
        // وضع السكينة من الفجر (4:30) إلى الشروق (6:00)
        const isSerenityTime = (hours === 4 && minutes >= 30) || (hours === 5) || (hours === 6 && minutes === 0);
        
        if (isSerenityTime) {
            document.body.classList.add('serenity-mode');
        } else {
            document.body.classList.remove('serenity-mode');
        }
    }
    
    // التحقق من عيد الفطر
    function checkForEid() {
        // هذا مثال - في التطبيق الحقيقي، ستستخدم تاريخًا دقيقًا
        const today = new Date();
        const isEidDay = today.getDate() === 30 && state.dayNumber === 30;
        
        if (isEidDay) {
            setTimeout(() => {
                elements.eidCelebration.classList.remove('hidden');
            }, 1000);
        }
    }
    
    // فتح نموذج المسبحة
    function openTasbihModal() {
        elements.tasbihModal.style.display = 'flex';
        elements.modalTasbihCount.textContent = state.tasbihCount;
        elements.tasbihType.textContent = state.currentDhikr;
    }
    
    // إغلاق نموذج المسبحة
    function closeTasbihModal() {
        elements.tasbihModal.style.display = 'none';
    }
    
    // زيادة عداد المسبحة
    function incrementTasbih() {
        state.tasbihCount++;
        elements.tasbihCount.textContent = state.tasbihCount;
        elements.modalTasbihCount.textContent = state.tasbihCount;
        
        // اهتزاز خفيف
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        saveToStorage();
    }
    
    // إعادة تعيين المسبحة
    function resetTasbih() {
        state.tasbihCount = 0;
        elements.tasbihCount.textContent = '0';
        elements.modalTasbihCount.textContent = '0';
        saveToStorage();
    }
    
    // تغيير الذكر
    function changeDhikr() {
        const dhikrOptions = ['سبحان الله', 'الحمد لله', 'الله أكبر', 'لا إله إلا الله', 'أستغفر الله'];
        const currentIndex = dhikrOptions.indexOf(state.currentDhikr);
        const nextIndex = (currentIndex + 1) % dhikrOptions.length;
        
        state.currentDhikr = dhikrOptions[nextIndex];
        elements.tasbihType.textContent = state.currentDhikr;
        saveToStorage();
    }
    
    // تحديث التقدم بناءً على الصلوات
    function updateProgressFromPrayers() {
        // حساب عدد الصلوات المكتملة
        const completedPrayers = Object.values(state.prayers).filter(Boolean).length;
        const totalPrayers = Object.keys(state.prayers).length;
        
        // تحديث التقدم (75% كقاعدة + نسبة الصلوات)
        const baseProgress = 50; // التقدم الأساسي
        const prayerProgress = (completedPrayers / totalPrayers) * 50; // 50% كحد أقصى للصلوات
        state.dailyProgress = Math.min(baseProgress + prayerProgress, 100);
        
        updateDayProgress();
        saveToStorage();
    }
    
    // تحديث نجوم خريطة الأثر
    function updateImpactStars() {
        // زيادة نجمة واحدة عند إكمال 5 صلوات
        const completedPrayers = Object.values(state.prayers).filter(Boolean).length;
        
        if (completedPrayers >= 5 && state.impactStars < 30) {
            state.impactStars++;
            createImpactStars();
            saveToStorage();
        }
    }
    
    // تحديث الواجهة من الحالة
    function updateUIFromState() {
        // تحديث المسبحة
        elements.tasbihCount.textContent = state.tasbihCount;
        
        // تحديث التبديلات
        elements.fajrToggle.checked = state.prayers.fajr;
        elements.dhuhrToggle.checked = state.prayers.dhuhr;
        elements.asrToggle.checked = state.prayers.asr;
        elements.maghribToggle.checked = state.prayers.maghrib;
        elements.ishaToggle.checked = state.prayers.isha;
        elements.taraweehToggle.checked = state.prayers.taraweeh;
        elements.quranToggle.checked = state.prayers.quran;
        elements.tahajjudToggle.checked = state.prayers.tahajjud;
        
        // تحديث واجهة المستخدم
        updateDayProgress();
        updateQuranProgress();
        updateDedication();
        createImpactStars();
    }
    
    // فتح نموذج القرآن
    function openQuranModal() {
        elements.quranModal.style.display = 'flex';
    }
    
    // إغلاق نموذج القرآن
    function closeQuranModal() {
        elements.quranModal.style.display = 'none';
    }
    
    // تحديث هدف الختمة
    function updateKhatmaTarget() {
        const target = parseInt(elements.khatmaTarget.value);
        if (target > 0) {
            state.quranProgress.targetKhatma = target;
            updateQuranProgress();
            saveToStorage();
        }
    }
    
    // إضافة تقدم القرآن
    function addQuranProgress() {
        const juz = parseInt(elements.addJuz.value) || 0;
        const pages = parseInt(elements.addPages.value) || 0;
        
        if (juz > 0 || pages > 0) {
            state.quranProgress.juz += juz;
            state.quranProgress.pages += pages;
            
            // تحديث القرآن كمكتمل
            state.prayers.quran = true;
            elements.quranToggle.checked = true;
            
            updateQuranProgress();
            updateProgressFromPrayers();
            saveToStorage();
            
            // إعادة تعيين الحقول
            elements.addJuz.value = 0;
            elements.addPages.value = 0;
        }
    }
    
    // فتح نموذج الإهداء
    function openDedicationModal() {
        elements.dedicationTo.value = state.dedication.to;
        elements.dedicationMessage.value = state.dedication.message;
        elements.dedicationModal.style.display = 'flex';
    }
    
    // إغلاق نموذج الإهداء
    function closeDedicationModal() {
        elements.dedicationModal.style.display = 'none';
    }
    
    // حفظ الإهداء
    function saveDedication() {
        const to = elements.dedicationTo.value.trim();
        const message = elements.dedicationMessage.value.trim();
        
        if (to && message) {
            state.dedication.to = to;
            state.dedication.message = message;
            updateDedication();
            saveToStorage();
            closeDedicationModal();
        }
    }
    
    // فتح نموذج الصلوات
    function openPrayerModal() {
        elements.prayerModal.style.display = 'flex';
    }
    
    // إغلاق نموذج الصلوات
    function closePrayerModal() {
        elements.prayerModal.style.display = 'none';
    }
    
    // فتح نموذج الإعدادات
    function openSettingsModal() {
        elements.settingsModal.style.display = 'flex';
    }
    
    // إغلاق نموذج الإعدادات
    function closeSettingsModal() {
        elements.settingsModal.style.display = 'none';
    }
    
    // تصدير البيانات
    function exportData() {
        // في التطبيق الحقيقي، ستقوم بإنشاء PDF
        // هنا سنقوم بإنشاء ملف نصي بسيط للعرض التوضيحي
        const dataStr = JSON.stringify(state, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'مفكرة-رمضان-بيانات.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        // عرض رسالة تأكيد
        alert('تم تصدير بياناتك بنجاح. يمكنك العثور على الملف في مجلد التنزيلات.');
    }
    
    // مسح البيانات
    function clearData() {
        if (confirm('هل أنت متأكد من رغبتك في مسح جميع البيانات؟ لا يمكن التراجع عن هذا الإجراء.')) {
            localStorage.removeItem('ramadanTracker');
            location.reload();
        }
    }
    
    // مشاركة تهنئة العيد
    function shareEid() {
        const shareText = `تهانينا بمناسبة عيد الفطر المبارك! لقد أكملت ${state.dayNumber} يومًا من الصيام والعبادة باستخدام تطبيق مفكرة رمضان.`;
        
        if (navigator.share) {
            navigator.share({
                title: 'عيد مبارك!',
                text: shareText,
                url: window.location.href
            });
        } else {
            // نسخ إلى الحافظة إذا لم يكن المشاركة متاحة
            navigator.clipboard.writeText(shareText).then(() => {
                alert('تم نسخ رسالة التهنئة إلى الحافظة. يمكنك مشاركتها الآن.');
            });
        }
    }

    // تهيئة التطبيق
    initializeApp();
});

