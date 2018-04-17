MY_TARGET_IN := $(MY_TARGET)
MY_TARGETDIR_IN := $(MY_TARGETDIR)
MY_SRCDIR_IN := $(MY_SRCDIR)
MY_SRCS_IN := $(MY_SRCS)
#MY_EXTRAOBJS_IN := $(MY_EXTRAOBJS)
#MY_CFLAGS_IN := $(MY_CFLAGS)
#MY_CPPFLAGS_IN := $(MY_CPPFLAGS)
#MY_LDFLAGS_IN := $(MY_LDFLAGS)
#MY_INCLUDES_IN := $(MY_INCLUDES)
#MY_LIBS_IN := $(MY_LIBS)
#MY_LIBPATHS_IN := $(MY_LIBPATHS)
MY_DEPS_IN := $(MY_DEPS)

$(warning MY_OBJS = $(MY_OBJS))

# extract the different source types out of the list
$(warning MY_SRCS_IN = $(MY_SRCS_IN))

$(MY_TARGET_IN):
	@echo building cmd: $@
	@echo from dir $(MY_SRCDIR_IN)
	@go build -o $@ ./cmd/agid 

MY_TARGET :=
MY_TARGETDIR :=
MY_SRCDIR :=
MY_SRCS :=
