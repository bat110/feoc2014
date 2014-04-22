DEFAULT: build

build:
	cd app && ../node_modules/.bin/cordova build android

install: build
	adb install -r app/platforms/android/ant-build/SampleApp-debug.apk

run: install
	adb shell am start -S \
		-a android.intent.action.MAIN \
		-c android.intent.category.LAUNCHER -f 0x10200000 \
		-n com.example.sampleapp/.SampleApp

test:
	./node_modules/mo_ocha/node_modules/.bin/mocha --harmony -R spec \
		-t 60000 test/specs.js

.PHONY: DEFAULT \
	build \
	install \
	run \
	test
