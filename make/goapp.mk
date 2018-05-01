MY_TARGET_IN := $(MY_TARGET)
MY_TARGETDIR_IN := $(MY_TARGETDIR)
MY_SRCDIR_IN := $(MY_SRCDIR)
MY_SRCS_IN := $(MY_SRCS)

$(warning MY_OBJS = $(MY_OBJS))
$(warning MY_SRCS_IN = $(MY_SRCS_IN) $(MY_TARGETDIR))

ifneq ($(MY_TARGET_IN), ) 

# build a list of objects
_TEMP_OBJS := $(addprefix $(MY_SRCDIR_IN)/, $(MY_SRCS_IN))
$(warning _TEMP_OBJS = $(_TEMP_OBJS))

$(MY_TARGET_IN):$(_TEMP_OBJS)
	@$(MKDIR)
	@mkdir -p $(MY_TARGETDIR_IN)
	@echo go build -o $@ $(_TEMP_OBJS) $^
	@go build -o $@ $^
endif

MY_TARGET :=
MY_TARGETDIR :=
MY_SRCDIR :=
MY_SRCS :=
MY_GOSRCS_IN :=
_TEMP_OBJS :=