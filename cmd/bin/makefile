MY_TARGET  :=  $(CMD_RELEASE_DIR)/bin.js
MY_TARGETDIR := $(CMD_RELEASE_DIR)
MY_SRCDIR :=  $(CMD_DIR)/bin

ifeq ($(call FINDINLIST,$(MY_TARGET),$(ALL)),1)

MY_SRCS := \
	cat.js\
	domglue.js\
	exec.js\
	fsdump.js\
	glue.js\
	image.js\
	init.js\
	login.js\
	ls.js\
	mkdir.js\
	mount.js\
	shell.js\
	stat.js\
	write.js\

include make/js_lib.mk

endif
