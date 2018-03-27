#cmd makefile
MY_TARGETDIR := $(CMD_BUILD_DIR)/agid
MY_TARGET := $(CMD_RELEASE_DIR)/agid

ifeq ($(call FINDINLIST,$(MY_TARGET),$(ALL)),1)
MY_SRCDIR := $(CMD_DIR)/agid
MY_TARGET := $(CMD_RELEASE_DIR)/agid
THIS_DIR  := $(CMD_DIR)/agid

MY_SRCS := \
	main.go

MY_INCLUDES :=
MY_CFLAGS :=
MY_LIBS := 
MY_LIBPATHS :=
MY_DEPS :=


include make/goapp.mk

#$(CMD_RELEASE_DIR)/agid:
#	@echo $(CMD_BUILD_DIR) - $(MY_SRCDIR) - $(CMD_DIR) - $(CMD_RELEASE_DIR) 
#	@echo srcdir = $(THIS_DIR)
#	@echo building cmd: $@
#	@go build -o $@ ./$(THIS_DIR)


endif
