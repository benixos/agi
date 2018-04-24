#cmd makefile
MY_TARGETDIR := $(CMD_RELEASE_DIR)/bin
MY_TARGET := $(CMD_RELEASE_DIR)/agid

ifeq ($(call FINDINLIST,$(MY_TARGET),$(ALL)),1)
MY_SRCDIR := $(CMD_DIR)/agid

MY_SRCS := \
	main.go

include make/goapp.mk

endif
