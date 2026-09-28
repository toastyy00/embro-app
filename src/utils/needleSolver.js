import { PREFERRED_FIXED_ORDER } from './colorPalette.js';

/**
 * Menghitung urutan jarum mesin bordir dan membaginya ke dalam tahapan (stages).
 * Menentukan benang jarum tetap terbaik (fixed needles) dan memetakan rotasi jarum swap.
 *
 * @param {Array} cmts - Daftar film/CMT yang aktif
 * @param {number} totalCap - Kapasitas total jarum mesin (contoh: 6, 9, 11, 12)
 * @param {number} swapNeedleNum - Nomor jarum yang dijadikan jarum ganti / swap
 * @param {Array} preferredOrder - Urutan preferensi warna tetap bawaan mesin
 * @returns {Object} { stagesList, threadToNeedle, overflowThreads, stage1NeedleUsage, primarySwap }
 */
export function calculateMachineStages(cmts = [], totalCap = 11, swapNeedleNum = 4, preferredOrder = PREFERRED_FIXED_ORDER) {
  if (!cmts || cmts.length === 0) {
    return {
      stagesList: [],
      threadToNeedle: {},
      overflowThreads: [],
      stage1NeedleUsage: {},
      primarySwap: swapNeedleNum,
    };
  }

  // 1. Hitung frekuensi kemunculan tiap benang per desain
  const freq = {};
  cmts.forEach((item) => {
    new Set(item.threads || []).forEach((t) => {
      freq[t] = (freq[t] || 0) + 1;
    });
  });

  // Jarum swap default ke jarum paling akhir jika di luar jangkauan kapasitas
  const primarySwap = swapNeedleNum >= 1 && swapNeedleNum <= totalCap ? swapNeedleNum : totalCap;

  // Urutkan benang berdasarkan popularitas penggunaan
  const rankedThreads = Object.keys(freq).sort((a, b) => {
    if (freq[b] !== freq[a]) return freq[b] - freq[a];
    const idxA = preferredOrder.indexOf(a);
    const idxB = preferredOrder.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.localeCompare(b);
  });

  // Slot jarum tetap: seluruh jarum selain primarySwap
  const nonSwapSlots = [];
  for (let i = 1; i <= totalCap; i++) {
    if (i !== primarySwap) nonSwapSlots.push(i);
  }
  const fixedCount = nonSwapSlots.length;

  // 2. Evaluasi dan pilih himpunan benang tetap terbaik (minimalkan varian multi-swap)
  function evaluateFixedSet(candidateSet) {
    let pureBase = 0;
    let singleSwap = 0;
    let multiSwap = 0;
    const dynamicThreads = new Set();

    cmts.forEach((item) => {
      const missing = (item.threads || []).filter((t) => !candidateSet.has(t));
      const uniqMissing = new Set(missing);
      if (uniqMissing.size === 0) pureBase++;
      else if (uniqMissing.size === 1) {
        singleSwap++;
        dynamicThreads.add([...uniqMissing][0]);
      } else {
        multiSwap++;
        uniqMissing.forEach((t) => dynamicThreads.add(t));
      }
    });

    return { multiSwap, dynamicCount: dynamicThreads.size, pureBase };
  }

  function compareFixedScores(s1, s2) {
    if (s1.multiSwap !== s2.multiSwap) return s1.multiSwap - s2.multiSwap;
    if (s1.dynamicCount !== s2.dynamicCount) return s1.dynamicCount - s2.dynamicCount;
    return s2.pureBase - s1.pureBase;
  }

  let bestFixedSet = new Set(rankedThreads.slice(0, Math.min(fixedCount, rankedThreads.length)));
  let bestFixedScore = evaluateFixedSet(bestFixedSet);

  const unselectedThreads = rankedThreads.filter((t) => !bestFixedSet.has(t));
  let improved = true;
  while (improved) {
    improved = false;
    for (const outTh of [...bestFixedSet]) {
      for (const inTh of unselectedThreads) {
        const candidate = new Set(bestFixedSet);
        candidate.delete(outTh);
        candidate.add(inTh);
        const score = evaluateFixedSet(candidate);
        if (compareFixedScores(score, bestFixedScore) < 0) {
          bestFixedSet = candidate;
          bestFixedScore = score;
          improved = true;
          break;
        }
      }
      if (improved) break;
    }
  }

  // Urutkan benang tetap ke nonSwapSlots
  const orderedFixedThreads = [...bestFixedSet].sort((a, b) => {
    const idxA = preferredOrder.indexOf(a);
    const idxB = preferredOrder.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    if (freq[b] !== freq[a]) return freq[b] - freq[a];
    return a.localeCompare(b);
  });

  const baseNeedleMapping = {};
  orderedFixedThreads.forEach((th, idx) => {
    baseNeedleMapping[th] = nonSwapSlots[idx];
  });

  // 3. Kelompokkan CMT berdasarkan kebutuhan benang dinamis
  const directItems = [];
  const singleSwapGroups = {};
  const multiSwapList = [];

  cmts.forEach((item) => {
    const missing = [...new Set((item.threads || []).filter((t) => !bestFixedSet.has(t)))];
    if (missing.length === 0) {
      directItems.push(item);
    } else if (missing.length === 1) {
      const th = missing[0];
      if (!singleSwapGroups[th]) singleSwapGroups[th] = [];
      singleSwapGroups[th].push(item);
    } else {
      multiSwapList.push({ item, missing });
    }
  });

  // 4. Susun Tahap-Tahap (Stages)
  const stagesList = [];
  const allRotatedSwapThreads = [];

  const singleSwapThreads = Object.keys(singleSwapGroups).sort((a, b) => {
    return singleSwapGroups[b].length - singleSwapGroups[a].length || freq[b] - freq[a];
  });

  const initialSwapThread = singleSwapThreads[0] || null;
  if (initialSwapThread) allRotatedSwapThreads.push(initialSwapThread);

  const stage1Items = [
    ...directItems,
    ...(initialSwapThread && singleSwapGroups[initialSwapThread] ? singleSwapGroups[initialSwapThread] : []),
  ];

  const stage1NeedleMap = { ...baseNeedleMapping };
  if (initialSwapThread) {
    stage1NeedleMap[initialSwapThread] = primarySwap;
  }

  // Helper untuk memetakan item CMT ke stage dengan dukungan Opsi Kombinasi Warna
  const mapCmtForStage = (c, needleMap) => {
    const needleSequence = (c.threads || []).map((t) =>
      needleMap[t] !== undefined ? 'J' + needleMap[t] : 'J?'
    );

    let combinationOptions = null;
    let hasCombinationOptions = false;

    const rawOpts = Array.isArray(c.threadOptions) ? c.threadOptions : null;
    const isCombo =
      (c.isCombination && rawOpts && rawOpts.some((opt) => Array.isArray(opt) && opt.length >= 2)) ||
      (rawOpts && rawOpts.length > 1 && rawOpts.some((opt) => Array.isArray(opt) && opt.length >= 2));

    if (isCombo) {
      hasCombinationOptions = true;
      combinationOptions = rawOpts.map((opt, optIdx) => {
        const threadList = Array.isArray(opt) ? opt : [opt];
        return {
          optIdx,
          label: `Opsi ${optIdx + 1}`,
          threads: threadList.map((th) => {
            const nNum = needleMap[th] !== undefined ? needleMap[th] : null;
            return {
              code: th,
              needleNum: nNum,
              needle: nNum !== null ? 'J' + nNum : 'J?',
            };
          }),
        };
      });
    }

    return {
      ...c,
      key: `${c.flopy ? c.flopy + '_' : ''}${c.cmt}_${c.variant || '-'}`,
      needleSequence,
      hasCombinationOptions,
      combinationOptions,
    };
  };

  // Tahap 1: Setup Awal
  if (stage1Items.length > 0 || singleSwapThreads.length === 0) {
    stagesList.push({
      title: 'Setup Awal',
      isSwapStage: false,
      swaps: initialSwapThread
        ? [{ needle: primarySwap, thread: initialSwapThread, isPrimary: true }]
        : [],
      swappedNeedles: initialSwapThread ? [primarySwap] : [],
      instruction: initialSwapThread
        ? `Pasang jarum tetap J1–J${totalCap} (selain J${primarySwap}). Pasang ${initialSwapThread} di Jarum ${primarySwap}.`
        : `Semua benang muat di mesin (${totalCap} jarum). Langsung jalan tanpa ganti benang.`,
      needleMap: stage1NeedleMap,
      items: stage1Items.map((c) => mapCmtForStage(c, stage1NeedleMap)),
    });
  }

  // Rekap status awal benang pada jarum di Tahap 1
  const stage1NeedleUsage = {};
  Object.keys(stage1NeedleMap).forEach((th) => {
    const n = stage1NeedleMap[th];
    stage1NeedleUsage[n] = th;
  });

  // State pelacak benang fisik di tiap jarum saat tahapan berganti
  const activeNeedleState = { ...stage1NeedleUsage };

  // Tahap-tahap Single Swap (Rotasi jarum ujung primarySwap saja)
  singleSwapThreads.slice(1).forEach((th) => {
    allRotatedSwapThreads.push(th);
    const stageMap = { ...baseNeedleMapping, [th]: primarySwap };
    const items = singleSwapGroups[th] || [];
    const prev = activeNeedleState[primarySwap] || '';
    activeNeedleState[primarySwap] = th;

    const swapDesc = prev ? `J${primarySwap} (${prev}) → ${th}` : `J${primarySwap} → ${th}`;
    stagesList.push({
      title: `Ganti ${swapDesc}`,
      isSwapStage: true,
      swaps: [{ needle: primarySwap, thread: th, prevThread: prev, isPrimary: true }],
      swappedNeedles: [primarySwap],
      instruction: `Ganti ${swapDesc}.`,
      needleMap: stageMap,
      items: items.map((c) => mapCmtForStage(c, stageMap)),
    });
  });

  // Tahap-tahap Multi-Swap (Seperti CMT yang butuh beberapa warna baru)
  let remainingMulti = [...multiSwapList];
  while (remainingMulti.length > 0) {
    const first = remainingMulti.shift();
    const currentStageItems = [first.item];
    const currentStageThreads = new Set(first.item.threads);

    let added = true;
    while (added) {
      added = false;
      for (let i = 0; i < remainingMulti.length; i++) {
        const cand = remainingMulti[i];
        const union = new Set([...currentStageThreads, ...cand.item.threads]);
        if (union.size <= totalCap) {
          currentStageItems.push(cand.item);
          cand.item.threads.forEach((t) => currentStageThreads.add(t));
          remainingMulti.splice(i, 1);
          added = true;
          break;
        }
      }
    }

    const usedBaseThreads = [...currentStageThreads].filter((t) => bestFixedSet.has(t));
    const usedBaseNeedles = new Set(usedBaseThreads.map((t) => baseNeedleMapping[t]));
    const missingThreads = [...currentStageThreads].filter((t) => !bestFixedSet.has(t));

    // Ambil jarum bebas dari ujung kanan rack
    const availableNeedles = [];
    if (!usedBaseNeedles.has(primarySwap)) availableNeedles.push(primarySwap);
    for (let n = totalCap; n >= 1; n--) {
      if (n !== primarySwap && !usedBaseNeedles.has(n)) {
        availableNeedles.push(n);
      }
    }

    const stageMap = { ...baseNeedleMapping };
    const swaps = [];

    missingThreads.forEach((th, idx) => {
      const assignedNeedle = availableNeedles[idx] || primarySwap;
      const prev = activeNeedleState[assignedNeedle] || '';
      stageMap[th] = assignedNeedle;
      swaps.push({
        needle: assignedNeedle,
        thread: th,
        prevThread: prev,
        isPrimary: assignedNeedle === primarySwap,
      });
      activeNeedleState[assignedNeedle] = th;
      if (!allRotatedSwapThreads.includes(th)) {
        allRotatedSwapThreads.push(th);
      }
    });

    swaps.sort((a, b) => a.needle - b.needle);
    const swapDesc = swaps
      .map((s) => (s.prevThread ? `J${s.needle} (${s.prevThread}) → ${s.thread}` : `J${s.needle} → ${s.thread}`))
      .join(', ');

    stagesList.push({
      title: `Ganti ${swapDesc}`,
      isSwapStage: true,
      swaps: swaps,
      swappedNeedles: swaps.map((s) => s.needle),
      instruction: `Ganti ${swapDesc}.`,
      needleMap: stageMap,
      items: currentStageItems.map((c) => mapCmtForStage(c, stageMap)),
    });
  }

  return {
    stagesList,
    threadToNeedle: baseNeedleMapping,
    overflowThreads: allRotatedSwapThreads,
    stage1NeedleUsage,
    primarySwap,
  };
}
