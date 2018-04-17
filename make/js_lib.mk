MY_TARGET_IN := $(MY_TARGET)
MY_STATIC_TARGET_IN := $(MY_STATIC_TARGET)
MY_TARGETDIR_IN := $(MY_TARGETDIR)
MY_SRCDIR_IN := $(MY_SRCDIR)
MY_SRCS_IN := $(MY_SRCS)
MY_OBJS_IN := $(MY_OBJS)
MY_CFLAGS_IN := $(MY_CFLAGS)
MY_CPPFLAGS_IN := $(MY_CPPFLAGS)
MY_INCLUDES_IN := $(MY_INCLUDES)
MY_LINKSCRIPT_IN := $(MY_LINKSCRIPT)

$(warning MY_OBJS = $(MY_OBJS))

#extract the different source types out of the list
#$(warning MY_SRCS_IN = $(MY_SRCS_IN))
MY_JSSRCS_IN := $(MY_SRCS_IN)

# build a list of objects
MY_JSSRCS_IN := $(addprefix $(MY_SRCDIR_IN)/,$(MY_JSSRCS_IN))
_TEMP_OBJS := $(MY_JSSRCS_IN)
#$(warning _TEMP_OBJS = $(MY_JSSRCS_IN))

ifneq ($(MY_TARGET_IN), ) 
$(MY_TARGET_IN): MY_TARGET_IN:=$(MY_TARGET_IN)
$(MY_TARGET_IN): MY_TARGETDIR_IN:=$(MY_TARGETDIR_IN) 
$(MY_TARGET_IN):$(_TEMP_OBJS)
	@$(MKDIR)
	@mkdir -p $(MY_TARGETDIR_IN)
	@echo linking library $@
#	
	@cat $(_TEMP_OBJS) > $@
endif

#MY_OBJS :=
MY_TARGET :=
MY_STATIC_TARGET := 
MY_TARGETDIR :=
MY_SRCDIR :=
MY_SRCS :=
MY_SRCS_IN :=
#MY_JSSRCS_IN :=
#_TEMP_OBJS :=
