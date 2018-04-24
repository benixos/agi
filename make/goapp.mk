MY_TARGET_IN := $(MY_TARGET)
MY_TARGETDIR_IN := $(MY_TARGETDIR)
MY_SRCDIR_IN := $(MY_SRCDIR)
MY_SRCS_IN := $(MY_SRCS)

#$(warning MY_OBJS = $(MY_OBJS))
#$(warning MY_SRCS_IN = $(MY_SRCS_IN))

ifneq ($(MY_TARGET_IN), ) 

# build a list of objects
MY_GOSRCS_IN := $(addprefix $(MY_SRCDIR_IN)/, $(MY_SRCS_IN))
_TEMP_OBJS := $(MY_GOSRCS_IN)
#$(warning _TEMP_OBJS = $(MY_GOSRCS_IN))

$(MY_TARGET_IN):$(_TEMP_OBJS)
	@echo building cmd: $@
	@go build -o $@ ./cmd/agid 
endif

MY_TARGET :=
MY_TARGETDIR :=
MY_SRCDIR :=
MY_SRCS :=
MY_GOSRCS_IN :=
_TEMP_OBJS :=