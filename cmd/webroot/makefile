#cmd makefile
MY_TARGETDIR := $(RELEASE_DIR)
MY_SRCDIR    := $(CMD_DIR)/webroot
MY_TARGET    := $(RELEASE_DIR)/index.html

ifeq ($(call FINDINLIST,$(MY_TARGET),$(ALL)),1)

MY_SRCS := \
	index.html\
#	rootfs.ini\

_TEMP_OBJS := $(addprefix $(MY_SRCDIR)/,$(MY_SRCS))
_DEST_OBJS := $(addprefix $(MY_TARGETDIR)/,$(MY_SRCS))

$(MY_TARGET): $(_TEMP_OBJS)
	@$(MKDIR)
	#@cp $(_TEMP_OBJS)  $(MY_TARGETDIR)
	@cat $^ > $@
endif

MY_TARGET :=
MY_STATIC_TARGET := 
MY_TARGETDIR :=
MY_SRCDIR :=
MY_SRCS :=
MY_SRCS_IN :=
MY_CFLAGS :=
MY_CPPFLAGS :=
MY_INCLUDES :=
MY_LINKSCRIPT :=
MY_LIBS := 
MY_LIBPATHS :=
