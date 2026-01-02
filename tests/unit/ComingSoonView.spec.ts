import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ComingSoonView from '@/views/ComingSoonView.vue'

describe('ComingSoonView', () => {
  it('renders the title prop', () => {
    const wrapper = mount(ComingSoonView, {
      props: {
        title: 'Files',
      },
    })

    expect(wrapper.text()).toContain('Files')
  })

  it('displays coming soon message', () => {
    const wrapper = mount(ComingSoonView, {
      props: {
        title: 'Commands',
      },
    })

    expect(wrapper.text()).toContain('coming soon')
  })

  it('has data-cy attribute for testing', () => {
    const wrapper = mount(ComingSoonView, {
      props: {
        title: 'Console',
      },
    })

    expect(wrapper.find('[data-cy="coming-soon"]').exists()).toBe(true)
  })
})
