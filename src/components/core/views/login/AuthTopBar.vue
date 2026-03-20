<!-- 授权页右上角组件 -->
<template>
  <div
    class="absolute w-full flex-cb top-4.5 z-10 flex-c !justify-end max-[1180px]:!justify-between"
  >
    <div class="flex-cc !hidden max-[1180px]:!flex ml-2 max-sm:ml-6">
      <ArtLogo class="icon" size="46" />
      <h1 class="text-xl font-medium ml-2">{{ AppConfig.systemInfo.name }}</h1>
    </div>

    <div class="flex shrink-0 items-center gap-2 mr-6 max-sm:mr-8">
      <!-- 语言切换下拉菜单 -->
      <ElDropdown
        trigger="hover"
        @command="changeLanguage"
      >
        <WnIconButton icon="meteor-icons:language" class="bg-surface!"/>
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem
              v-for="item in languageOptions"
              :key="item.value"
              :command="item.value"
              :class="{ 'is-active': locale === item.value }"
            >
              <div class="flex-cb w-full gap-2">
                <span class="text-sm">{{ item.label }}</span>
                <WnSvgIcon
                  v-if="locale === item.value"
                  icon="charm:tick"
                  class="text-color-text-main!"
                />
              </div>
            </ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>

      <!-- 主题切换按钮 -->
      <WnIconButton
        :icon="isDark ? 'uil:sun' : 'iconamoon:mode-dark-bold'"
        @click="themeAnimation"
        class="bg-surface!"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { useSettingStore } from '@/store/setting'
  import { useUserStore } from '@/types/api/user.model'
  import { useHeaderBar } from '@/hooks/core/useHeaderBar'
  import { themeAnimation } from '@/utils/ui/animation'
  import { languageOptions } from '@/locales'
  import { LanguageEnum } from '@/enums/appEnum'
  import AppConfig from '@/config'

  defineOptions({ name: 'AuthTopBar' })

  const settingStore = useSettingStore()
  const userStore = useUserStore()
  const { isDark } = storeToRefs(settingStore)
  const { shouldShowThemeToggle, shouldShowLanguage } = useHeaderBar()
  const { locale } = useI18n()

  const changeLanguage = (lang: LanguageEnum) => {
    if (locale.value === lang) return
    locale.value = lang
    userStore.setLanguage(lang)
  }
</script>
