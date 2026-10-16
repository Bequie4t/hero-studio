# Hero Studio

자캐(오리지널 캐릭터) 덕후를 위한 무료 홈페이지 메이커입니다. 템플릿을 고르고 글, 그림, 색을 바꾸면 실시간으로 미리 보이고, 완성된 페이지는 **파일 하나(HTML)** 또는 **React 프로젝트(zip)** 로 받을 수 있어요. 가입도 서버도 필요 없습니다.

## 실행

    npm install
    npm run dev       # 편집기: http://localhost:5173
    npm run build     # dist/ 에 정적 파일 생성
    npm run check     # 모든 템플릿의 입력 이스케이프 검사 + 스프라이트 검사

## 화면 구조

- `#/` 랜딩페이지, `#/templates` 템플릿 목록, `#/t/<id>` 편집기, `#c=...` 공유 링크
- 편집기의 **무료로 공개하기** 버튼이 배포용 zip(`index.html`)과 Netlify Drop, Cloudflare Pages, GitHub Pages 업로드 방법을 안내합니다.

## 템플릿

덕질용(`group: '덕질'`): 자캐 설정집, 자캐 커플 아카이브, 자캐 커뮤니티, 덕질 홈
일반(`group: '일반'`): 픽셀 마스코트, 터미널 런치, 소프트 오브, 폴리오, 스토어프론트, 이벤트 카운트다운

각 템플릿(`src/templates/*.js`)은 `{ id, group, name, blurb, tag, defaults, fields, palettes, build, fonts }`를 내보냅니다.

- `build(config, { fontCss })` 가 완성된 HTML 문자열을 돌려줘요. 미리보기와 다운로드가 같은 함수를 쓰므로 보이는 그대로 저장됩니다.
- 편집 패널은 `fields` 정의로 자동 생성돼요. 필드 종류: text, textarea, select, choice, range, check, colors, palette, date, datetime, image(한 장), images(여러 장).
- 새 템플릿은 파일을 만들고 `src/templates/index.js`에 등록하면 목록과 랜딩에 자동으로 나타납니다.
- 사용자 입력은 모두 이스케이프하고, 링크는 http(s)/`#`/`/`/`mailto:`만, 색은 6자리 hex만, 이미지는 `data:image/...;base64`만 받아요. `npm run check`가 모든 필드에 악성 입력을 넣어 HTML 파서로 검사합니다.

## 폰트

- 라틴 폰트: `src/fonts/registry.js`, `node scripts/fonts.mjs`로 `@fontsource`에서 복사.
- 한글 폰트: `src/fonts/ko-registry.js`. `node scripts/ko-fonts.mjs`가 원본 폰트를 자주 쓰는 한글 2,350자 + 라틴 + 기호로 줄여 `public/fonts/ko/*.woff`에 만들어요.
- 편집기는 페이지에 **실제로 쓰인 글자와 굵기만** 남기도록 브라우저에서 한 번 더 줄이고(`src/fonts/subset.js`, harfbuzz WASM) data URI로 파일에 넣어요. 그래서 다운로드한 페이지는 외부 폰트 서버를 쓰지 않고, 폰트 용량도 작아요.

## 이미지

업로드한 이미지는 브라우저에서 크기를 줄이고(`src/images.js`) 파일 안에 넣어요. 서버로 보내지 않습니다. React 내보내기에서는 `src/assets/`의 실제 파일로 분리돼요. 대표 일러스트로 밝은/어두운 색 테마를 만드는 기능도 `src/images.js`에 있습니다.

## 무료로 배포하기

`dist/`는 정적 파일이라 GitHub Pages, Netlify, Cloudflare Pages, Vercel 어디든 올릴 수 있어요.
