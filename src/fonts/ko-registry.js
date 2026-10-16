// Korean fonts available to templates. Weights match the files in public/fonts/ko (built by scripts/ko-fonts.mjs).
export const KO_FONTS = {
  pretendard: { family: 'Pretendard', label: '프리텐다드 (깔끔한 고딕)', weights: [400, 500, 700, 800], stack: "'Pretendard',system-ui,sans-serif" },
  gowunbatang: { family: 'Gowun Batang', label: '고운바탕 (감성 명조)', weights: [400, 700], stack: "'Gowun Batang','Noto Serif KR',serif" },
  gowundodum: { family: 'Gowun Dodum', label: '고운돋움 (부드러운 돋움)', weights: [400], stack: "'Gowun Dodum',system-ui,sans-serif" },
  jua: { family: 'Jua', label: '주아 (동글동글 제목용)', weights: [400], stack: "'Jua',system-ui,sans-serif" },
  blackhan: { family: 'Black Han Sans', label: '블랙한산스 (굵은 제목용)', weights: [400], stack: "'Black Han Sans',system-ui,sans-serif" },
  nanumpen: { family: 'Nanum Pen Script', label: '나눔손글씨 펜 (손글씨)', weights: [400], stack: "'Nanum Pen Script',cursive" },
}
export const koStack = (id) => (KO_FONTS[id] || KO_FONTS.pretendard).stack
export const koOptions = (ids) => ids.map((id) => ({ id, label: KO_FONTS[id].label }))
